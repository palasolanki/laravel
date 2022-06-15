import React, { useState, Fragment, useEffect } from "react";
import api from "../../helpers/api";
import DatePicker from "react-datepicker";
import { ToastsStore } from "react-toasts";
const $ = require("jquery");

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
    const [configs, setConfigs] = useState({});
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
        api.get("/configs")
            .then(res => {
                setConfigs(res.data.configs);
            })
            .catch(res => {});

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
                    setCurrencySign(assignCurrencySign(res.data.editInvoice[0].currency));
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
            amount_due: total - value
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
                lines: [...newArr]
            });
            setCheckLineTotal(true);
            return;
        }
        if (e.target.name === "currency") {
            setCurrencySign(assignCurrencySign(val))
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
            tax=1.18;
        }
        let total = subTotal*tax;
        setTotal(total);
        setInvoice({ ...invoice, amount_due: total-invoice.amount_paid });

        
    }, [subTotal, isGstSelected])

    useEffect(() => {
        calculateTaxes(invoice.gst_option);
    }, [invoice.gst_option]);

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
        if(subTotal === 0 || Object.keys(configs).length === 0) return;
        switch (val) {
            case "same_state":
                setTaxes({...taxes, SGST:(configs.SGST*subTotal)/100, CGST:(configs.CGST*subTotal)/100, IGST: 0 });
                break;
    
            case "other_state":
                setTaxes({...taxes, IGST:(configs.IGST*subTotal)/100, SGST:0, CGST:0});
                break;
    
            case "no":
                setTaxes({...taxes, IGST:0, SGST:0, CGST:0});
                break;
            default:
                break;
        }
    }

    const assignCurrencySign = (val) => {

        switch (val) {
            case "USD":
                return "$";

            case "EUR":
                return "€";

            case "INR":
                return "₹";

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

    const downloadFile = res => {
        const url = window.URL.createObjectURL(new Blob([res.data]));
        const link = document.createElement("a");
        link.href = url;
        const contentDisposition = res.headers["content-disposition"];
        let fileName = "invoice.pdf";
        if (contentDisposition) {
            const fileNameMatch = contentDisposition.match(/filename="(.+)"/);
            if (fileNameMatch.length === 2) {
                fileName = fileNameMatch[1];
            }
        }
        link.setAttribute("download", fileName);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
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
                                                    <option value="USD">
                                                        USD
                                                    </option>
                                                    <option value="EUR">
                                                        EUR
                                                    </option>
                                                    <option value="INR">
                                                        INR
                                                    </option>
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
                                                <a
                                                    className="cut-invoice-btn"
                                                    onClick={() =>
                                                        removeRow(index)
                                                    }
                                                >
                                                    -
                                                </a>
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
                                                <span>{configs.SAC_code}</span>
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
                                                    {row.quantity}
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
                                                <span>{row.amount}</span>
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
                                                <span>{subTotal}</span>
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
                                                            SGST @ {configs.SGST}%
                                                        </span>
                                                    </th>
                                                    <td>
                                                        <span data-prefix>
                                                            {currencySign}
                                                        </span>
                                                        <span>{taxes.SGST}</span>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <th>
                                                        <span
                                                            suppressContentEditableWarning={
                                                                true
                                                            }
                                                        >
                                                            CGST @ {configs.CGST}%
                                                        </span>
                                                    </th>
                                                    <td>
                                                        <span data-prefix>
                                                            {currencySign}
                                                        </span>
                                                        <span>{taxes.CGST}</span>
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
                                                        IGST @ {configs.IGST}%
                                                    </span>
                                                </th>
                                                <td>
                                                    <span data-prefix>
                                                        {currencySign}
                                                    </span>
                                                    <span>{taxes.IGST}</span>
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
                                                    {invoice.amount_paid}
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
                                                <span
                                                    onBlur={e => {
                                                        setCurrencySign(
                                                            e.target.innerText
                                                        );
                                                    }}
                                                >
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
