import React, { useState, Fragment, useEffect } from "react";
import api from "../../helpers/api";
import DatePicker from "react-datepicker";
import { ToastsStore } from "react-toasts";
import config from "../../helpers/config";
import { downloadFile } from "../../helpers";

const AddInvoices = props => {
    const invoiceId = props.match.params.id || null;

    const initialRow = {
        item: "",
        quantity: 0,
        hourly_rate: 0,
        amount: 0
    };

    const [invoice, setInvoice] = useState({
        client_id: "",
        number: "",
        lines: [initialRow],
        date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 5)),
        amount_due: 0,
        amount_paid: 0,
        notes: "",
        status: "open",
        currency: "USD",
        gst_option: "no",
        bill_from: `Radicalloop Technolabs LLP,
        India
        GST No.: 24AAUFR2815E1Z6`,
        bill_to: { name: "", address: "", hourly_rate: 0 }
    });

    const [currencySign, setCurrencySign] = useState("$");
    const [total, setTotal] = useState(0);
    const [checkLineTotal, setCheckLineTotal] = useState(false);
    const [clients, setClients] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [shouldChangeStatus, setShouldChangeStatus] = useState(false);
    const [gstConfigs, setGstConfigs] = useState({});
    const [subTotal, setSubTotal] = useState(0);
    const [isGstSelected, setIsGstSelected] = useState(false);
    const [taxes, setTaxes] = useState({
        IGST:0,
        SGST:0,
        CGST:0
    });

    // initial effects
    useEffect(() => {
        calculateLineTotal();
        const fetchGstConfigs = async () => {
            await api.get("/gst-configs")
            .then(res => {
                setGstConfigs(res.data.gstConfigs);
            })
            .catch(res => {});
        }
        fetchGstConfigs();
        
        api.get("/getClients")
            .then(res => {
                setClients(res.data.clients);
            })
            .catch(res => {});
        if (invoiceId) return;
        api.get("/invoices/next-invoice-number").then(res => {
            setInvoice({ ...invoice, number: res.data.nextInvoiceNumber });
        });
    }, []);

    useEffect(
        () => {
            if (!invoiceId) return;
            api.get("/invoice/" + invoiceId)
                .then(res => {
                    let date = new Date(res.data.editInvoice[0].date);
                    let dueDate = new Date(res.data.editInvoice[0].due_date);
                    const respEditInvoice = {
                        ...res.data.editInvoice[0],
                        date,
                        due_date: dueDate
                    };
                    setCurrencySign(config.currencies.find(currency => currency.code === res.data.editInvoice[0].currency).sign);
                    setInvoice(respEditInvoice);
                    setIsGstSelected((respEditInvoice.gst_option!='no')? true : false);

                })
                .catch(err => {});
        },
        [invoiceId]
    );

    const clientList =
    clients &&
    clients.map((client, key) => {
        return (
            <option value={client._id} key={key}>
                {client.name + ` (` + (client.company_name || "N/A") + `)`}
            </option>
        );
    });

    //Form handling events
    const handleChange = index => e => {
        let name = e.target.getAttribute("name");

        if (typeof index !== "number") {
            setInvoice({ ...invoice, [name]: e.target.innerText });
            return;
        }
        let newArr = [...invoice.lines];
        newArr[index] = { ...newArr[index], [name]: e.target.innerText };
        setInvoice({ ...invoice, lines: [...newArr] });

        if (name == "quantity" || name == "hourly_rate") {
            setCheckLineTotal(true);
            setShouldChangeStatus(true);
        }
    };

    const onAmountPaidChange = e => {
        let value = (e.target.innerHTML != '')  ? e.target.innerHTML : 0;
        setShouldChangeStatus(true);
        setInvoice({
            ...invoice,
            amount_paid: value,
            amount_due: Number(total).toFixed(2) - value
        });
    };

    const onChange = (e, name) => {        
        if (e instanceof Date) {
            setInvoice({ ...invoice, [name]: e });
            return;
        }
        let val = e.target.value;
        if(e.target.name === "gst_option"){
            setIsGstSelected((val!='no')? true : false);
            calculateTaxes(val);
            setInvoice({
                ...invoice,
                gst_option: e.target.value
            })
        }

        if (e.target.name === "client_id") {
            let bill_to = clients.find(client => client._id === val) || {
                name: "",
                address: "",
                hourly_rate: 0
            };

            let newArr = [...invoice.lines];

            // logic to change unit price for all row in invoice list when client change.
            invoice.lines.map((line, key) => {
                newArr[key] = {
                    ...newArr[key],
                    hourly_rate: bill_to.hourly_rate || 0,
                    item: (key == 0) ? bill_to.invoice_item_title : ''
                };
            });        

            setInvoice({
                ...invoice,
                client_id: val,
                bill_to: bill_to,
                currency: bill_to.currency || "USD",
                lines: [...newArr]
            });
            setCheckLineTotal(true);
            return;
        }
        if (e.target.name === "currency") {
            setCurrencySign(config.currencies.find(currency => currency.code === val).sign || "$");
            setInvoice({ ...invoice, currency: val });
            return;
        }
        setInvoice({ ...invoice, [e.target.name]: val });
    };

    //other useEffects

    useEffect(
        () => {
            if (!checkLineTotal) return;
            calculateLineTotal();
        },
        [checkLineTotal]
    );

    useEffect(
        () => {
            setSubTotal(getTotalAmount());
        },
        [invoice.lines]
    );

    useEffect(
        () => {
            if (shouldChangeStatus){
                setInvoice({...invoice, status: (invoice.amount_due > 0) ? "open" : "paid"});
            }
        },
        [invoice.amount_due]
    );

    useEffect(() => {
        let tax = 1;
        if(isGstSelected)
        {
            calculateTaxes(invoice.gst_option);
            switch(invoice.gst_option)
            {
                case "same_state":
                    tax=(gstConfigs.SGST+gstConfigs.CGST+100)/100;
                break;

                case "other_state":
                    tax=(gstConfigs.IGST+100)/100;
                break;

                default:
                    tax = 1;
                break;
            }
        }
        let total = subTotal * tax;
        setTotal(total);
        setInvoice({ ...invoice, amount_due: total-invoice.amount_paid });

        
    }, [subTotal, isGstSelected])

    useEffect(() => {
        calculateTaxes(invoice.gst_option);
    }, [invoice.gst_option]);

    useEffect(() => {
        setCurrencySign(config.currencies.find(currency => currency.code === invoice.currency).sign || "$")
    },[invoice.currency])

    //other functions
    const getTotalAmount = () => {
        return invoice.lines.reduce(function(prev, cur) {
            return prev + cur.amount;
        }, 0);
    };

    const calculateLineTotal = () => {
        if (invoice.lines.length === 0) return;
        let modifiedArr = invoice.lines.map(item => {
            let modifiedItem = Object.assign({}, item);
            return {
                ...modifiedItem,
                amount: modifiedItem.quantity * modifiedItem.hourly_rate
            };
        });
        setInvoice({ ...invoice, lines: [...modifiedArr] });
        setCheckLineTotal(false);
    };

    const calculateTaxes = (val) => {
        if(subTotal === 0 || Object.keys(gstConfigs).length === 0) return;
        switch (val) {
            case "same_state":
                setTaxes({...taxes, SGST:(gstConfigs.SGST*subTotal)/100, CGST:(gstConfigs.CGST*subTotal)/100, IGST: 0 });
                break;
    
            case "other_state":
                setTaxes({...taxes, IGST:(gstConfigs.IGST*subTotal)/100, SGST:0, CGST:0});
                break;
    
            case "no":
                setTaxes({...taxes, IGST:0, SGST:0, CGST:0});
                break;
            default:
                break;
        }
    }

    // add/remove items rows functions
    const addRow = () => {
        setInvoice({ ...invoice, lines: [...invoice.lines, {...initialRow, hourly_rate: invoice.lines[0].hourly_rate}]});
    };

    const removeRow = index => {
        var array = [...invoice.lines];
        array.splice(index, 1);
        setInvoice({ ...invoice, lines: [...array] });
    };

    //Form submit events
    const saveInvoice = event => {
        setDisabled(true);

        if(isNaN(invoice.amount_paid))
        {
            setDisabled(false);
            ToastsStore.error("Amount Paid is not a number");
            return;
        }
        
        if (!invoice.lines.length || !total) {
            setDisabled(false);
            ToastsStore.error("Invalid Invoice Item or total");
            return;
        }
        api.post(
            `/invoices/add`,
            { ...invoice, total, sub_total: subTotal },
            { responseType: "blob" }
        )
            .then(res => {
                setDisabled(false);
                ToastsStore.success("Invoice saved successfully.");
                downloadFile(res);
                props.history.push("/invoices");
            })
            .catch(function(err) {
                ToastsStore.error(
                    "Oops something's missing! Re-generate invoice."
                );
                setDisabled(false);
                console.log(err);
            });
    };

    const editInvoice = (isDownload = true) => {

        setDisabled(true);

        if(isNaN(invoice.amount_paid))
        {
            setDisabled(false);
            ToastsStore.error("Amount Paid is not a number");
            return;
        }

        if (!invoice.lines.length || !total) {
            setDisabled(false)
            ToastsStore.error("Invalid Invoice Item or Total");
            return;
        }
        api.post(
            `/invoices/edit`,
            { ...invoice, total, sub_total: subTotal },
            {
                responseType: "blob"
            }
        )
            .then(res => {
                setDisabled(false);
                if(isDownload)
                {
                    downloadFile(res);
                }
                ToastsStore.success("Invoice updated successfully.");
            })
            .catch(function(err) {
                setDisabled(false);
                ToastsStore.error(
                    "Something went wrong! Please generate invoice again."
                );
                console.log(err);
            });
    };

    return (
        <Fragment>
            <div className="invoice-form">
                <div className="invoice-body" style={{ overflow: "auto" }}>
                    <div className="invoice-header">
                        <h1 className="invoice-h1">Invoice</h1>
                        <div
                            className="invoice-address"
                            name="bill_from"
                        >
                            Radicalloop Technolabs LLP
                            <br /> 601/A, Parshwanath Esquare, Corporate Road,
                            Prahladnagar,
                            <br /> Ahmedabad - 380015, Gujarat, India.
                            <br /> GSTIN: 24AAUFR2815E1Z6
                            <br /> www.radicalloop.com | hello@radicalloop.com
                        </div>
                    </div>
                    <article>
                        <div style={{ float: "left", width: "20%" }}>
                            <div>
                                <span>Bill To:</span>
                                <div suppressContentEditableWarning={true}>
                                    <select
                                        name="client_id"
                                        onChange={onChange}
                                        value={invoice.client_id}
                                        className="form-control"
                                    >
                                        <option value="">Select Client</option>
                                        {clientList}
                                    </select>
                                </div>
                            </div>
                            <div className="invoice-address">
                                {invoice.bill_to.address}
                            </div>
                            <div className="mt-3 mb-4">
                                <span>Status:</span>
                                <div
                                    contentEditable={true}
                                    suppressContentEditableWarning={true}
                                >
                                    <select
                                        name="status"
                                        onChange={onChange}
                                        value={invoice.status}
                                        className="form-control"
                                    >
                                        <option value="open">Open</option>
                                        <option value="paid">Paid</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className="invoice-table">
                            <div style={{ float: "right", width: "80%" }}>
                                <table className="meta">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Invoice #
                                                </span>
                                            </th>
                                            <td>
                                                <span name="number">
                                                    {invoice.number}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Date
                                                </span>
                                            </th>
                                            <td>
                                                <DatePicker
                                                    selected={invoice.date}
                                                    onChange={e =>
                                                        onChange(e, "date")
                                                    }
                                                    dateFormat="MMMM dd, yyyy"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Due Date
                                                </span>
                                            </th>
                                            <td>
                                                <DatePicker
                                                    selected={invoice.due_date}
                                                    onChange={e =>
                                                        onChange(e, "due_date")
                                                    }
                                                    dateFormat="MMMM dd, yyyy"
                                                />
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Currency
                                                </span>
                                            </th>
                                            <td>
                                                <select
                                                    name="currency"
                                                    onChange={onChange}
                                                    value={invoice.currency}
                                                    className="form-control"
                                                >
                                                    {config.currencies.map((value,key) => {
                                                        return (
                                                            <option
                                                                value={value.code}
                                                                key={key}
                                                            >
                                                                {value.code}
                                                            </option>
                                                        );
                                                    })}
                                                </select>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <table className="inventory">
                                <tbody>
                                    <tr>
                                        <th>
                                            <span
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Item
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                SAC Code
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Qty. / Hrs.
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Unit Price
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Amount
                                            </span>
                                        </th>
                                    </tr>

                                    {invoice.lines.map((row, index) => (
                                        <tr key={index}>
                                            <td>
                                                {invoice.lines.length > 1 && (
                                                    <a
                                                        className="cut-invoice-btn"
                                                        onClick={() =>
                                                            removeRow(index)
                                                        }
                                                    >
                                                        -
                                                    </a>
                                                )}
                                                <span
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                    name="item"
                                                    onBlur={handleChange(index)}
                                                    style={{
                                                        wordBreak: "break-all"
                                                    }}
                                                >
                                                    {row.item}
                                                </span>
                                            </td>
                                            <td>
                                                <span>{gstConfigs.SAC_code}</span>
                                            </td>

                                            <td>
                                                <span
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                    name="quantity"
                                                    onBlur={handleChange(index)}
                                                >
                                                    {Number(row.quantity).toFixed(2)}
                                                </span>
                                            </td>
                                            <td>
                                                <span data-prefix>
                                                    {currencySign}
                                                </span>
                                                <span
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                    name="hourly_rate"
                                                    onBlur={handleChange(index)}
                                                >
                                                    {row.hourly_rate ||
                                                        invoice.bill_to
                                                            .hourly_rate ||
                                                        0}
                                                </span>
                                            </td>
                                            <td>
                                                <span data-prefix>
                                                    {currencySign}
                                                </span>
                                                <span>{Number(row.amount).toFixed(2)}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <a className="add-invoice-btn" onClick={addRow}>
                                +
                            </a>
                            <div style={{ float: "left", width: "20%" }}>                                
                                <div className="mt-3 mb-4">
                                    <span>GST ?</span>
                                    <div>
                                        <select
                                            name="gst_option"
                                            onChange={onChange}
                                            value={invoice.gst_option}
                                            className="form-control"
                                        >
                                            <option value="no">No</option>
                                            <option value="same_state">Same State</option>
                                            <option value="other_state">Other State</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div style={{ float: "right", width: "80%" }}>
                                <table className="balance">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Subtotal
                                                </span>
                                            </th>
                                            <td>
                                                <span data-prefix>
                                                    {currencySign}
                                                </span>
                                                <span>{Number(subTotal).toFixed(2)}</span>
                                            </td>
                                        </tr>
                                        {invoice.gst_option === 'same_state' && (
                                            <>
                                                <tr>
                                                    <th>
                                                        <span
                                                            suppressContentEditableWarning={
                                                                true
                                                            }
                                                        >
                                                            SGST @ {gstConfigs.SGST}%
                                                        </span>
                                                    </th>
                                                    <td>
                                                        <span data-prefix>
                                                            {currencySign}
                                                        </span>
                                                        <span>{Number(taxes.SGST).toFixed(2)}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <span
                                                            suppressContentEditableWarning={
                                                                true
                                                            }
                                                        >
                                                            CGST @ {gstConfigs.CGST}%
                                                        </span>
                                                    </th>
                                                    <td>
                                                        <span data-prefix>
                                                            {currencySign}
                                                        </span>
                                                        <span>{Number(taxes.CGST).toFixed(2)}</span>
                                                    </td>
                                                </tr>
                                            </>
                                        )}

                                        {invoice.gst_option === 'other_state' && (
                                            <tr>
                                                <th>
                                                    <span
                                                        suppressContentEditableWarning={
                                                            true
                                                        }
                                                    >
                                                        IGST @ {gstConfigs.IGST}%
                                                    </span>
                                                </th>
                                                <td>
                                                    <span data-prefix>
                                                        {currencySign}
                                                    </span>
                                                    <span>{Number(taxes.IGST).toFixed(2)}</span>
                                                </td>
                                            </tr>
                                        )}
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Total
                                                </span>
                                            </th>
                                            <td>
                                                <span data-prefix>
                                                    {currencySign}
                                                </span>
                                                <span>{Number(total).toFixed(2)}</span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Paid
                                                </span>
                                            </th>
                                            <td>
                                                <span data-prefix>
                                                    {currencySign}
                                                </span>
                                                <span
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                    name="amount_paid"
                                                    onBlur={onAmountPaidChange}
                                                >
                                                    {Number(invoice.amount_paid).toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Amount Due
                                                </span>
                                            </th>
                                            <td>
                                                <span>
                                                    {currencySign}
                                                </span>
                                                <span id="amount_due">
                                                    {Number(invoice.amount_due).toFixed(2)}
                                                </span>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </article>
                    <aside>
                        <span>Notes</span>
                        <div>
                            <textarea
                                style={{
                                    border: "none",
                                    boxShadow: "none"
                                }}
                                className="form-control"
                                rows="6"
                                placeholder="Enter Note"
                                name="notes"
                                onChange={onChange}
                                value={invoice.notes || ""}
                            />
                        </div>
                    </aside>
                    <div className="form-group text-right invoice-save-btn">
                        {invoiceId && (
                                <button
                                    type="button"
                                    id="edit_save_button"
                                    onClick={() => editInvoice(false)}
                                    className="btn btn--prime mr-1"
                                    disabled={disabled}
                                >
                                    Update
                                </button>
                            )
                        }
                        <button
                            type="button"
                            id="edit_save_button"
                            onClick={invoiceId ? editInvoice : saveInvoice}
                            className="btn btn--prime mr-1"
                            disabled={disabled}
                        >
                            {invoiceId
                                ? "Update & Download"
                                : "Save & Download"}
                        </button> 
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AddInvoices;
