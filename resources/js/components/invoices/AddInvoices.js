import React, { useState, Fragment, useEffect } from "react";
import api from "../../helpers/api";
import DatePicker from "react-datepicker";
import { ToastsStore } from "react-toasts";

const AddInvoices = props => {
    const initialRow = {
        item: "",
        quantity: 0,
        rate: 0,
        amount: 0
    };

    const [invoice, setInvoice] = useState({
        client_id: '',
        number: '',
        lines: [initialRow],
        date: new Date(),
        due_date: new Date(new Date().setDate(new Date().getDate() + 10)),
        amount_due: 0,
        amount_paid: 0,
        notes: '',
        bill_from: 'Radicalloop Technolabs LLP',
        bill_to: { name: '', address: '' },
    });

    const [currencySign, setCurrencySign] = useState("$");
    const [total, setTotal] = useState(0);
    const [isCheckAmount, setCheckAmount] = useState(false);
    const [clients, setClients] = useState([]);

    const handleChange = (index) => (e) => {
        let name = e.target.getAttribute('name');
        if (typeof (index) !== "number") {
            setInvoice({ ...invoice, [name]: e.target.innerText });
            return;
        }
        let newArr = [...invoice.lines];
        newArr[index] = { ...newArr[index], [name]: e.target.innerText };
        setInvoice({ ...invoice, lines: [...newArr] });

        if (name == "quantity" || name == "rate") {
            setCheckAmount(true);
        }
    };

    useEffect(() => {
        setTotalAmount();
        api.get("/getClients")
            .then(res => {
                setClients(res.data.clients);
            })
            .catch(res => { });
    }, []);

    const clientList =
        clients &&
        clients.map((client, key) => {
            return (
                <option value={client._id} key={key}>
                    {client.name}
                </option>
            );
        });

    useEffect(() => {
        if (!isCheckAmount) return;
        setTotalAmount();
    }, [isCheckAmount]);

    useEffect(() => {
        setTotal(getTotalAmount());
    }, [invoice.lines]);

    const getTotalAmount = () => {
        return invoice.lines.reduce(function (prev, cur) {
            return prev + cur.amount;
        }, 0);
    };

    const setTotalAmount = () => {
        if (invoice.lines.length === 0) return;
        let modifiedArr = invoice.lines.map(item => {
            let modifiedItem = Object.assign({}, item);
            return {
                ...modifiedItem,
                amount: modifiedItem.quantity * modifiedItem.rate
            };
        });
        setInvoice({ ...invoice, lines: [...modifiedArr] });
        setCheckAmount(false);
    };

    const addRow = () => {
        setInvoice({ ...invoice, lines: [...invoice.lines, initialRow] });
    };

    const removeRow = index => {
        var array = [...invoice.lines];
        array.splice(index, 1);
        setInvoice({ ...invoice, lines: [...array] });
    };

    const onChange = (e, name) => {
        if (e instanceof Date) {
            setInvoice({ ...invoice, [name]: e });
            return;
        }
        let val = e.target.value;
        if (e.target.name === "client_id") {
            let bill_to = clients.find(client => client._id === val) || {
                name: "",
                address: ""
            };
            setInvoice({ ...invoice, client_id: val, bill_to: bill_to });
            return;
        }
        setInvoice({ ...invoice, [e.target.name]: val });
    };

    const saveInvoice = () => {
        if (!invoice.lines.length || !total || !invoice.bill_from) {
            ToastsStore.error("Invoice Field is required");
            return;
        }
        api.post(`/invoices/add`, { ...invoice, amount_due: total })
            .then(res => {
                window.open(res.data.link, '_blank');
                props.history.push('/invoices');
                ToastsStore.success('Invoice Save Successfully...');
            })
            .catch(function (err) {
                console.log(err);
            });
    };
    return (
        <Fragment>
            <div className="invoice-form">
                <div className="invoice-body">
                    <div className="invoice-header">
                        <h1 className="invoice-h1">Invoice</h1>
                        <address
                            contentEditable={true}
                            suppressContentEditableWarning={true}
                            name="bill_from"
                            onBlur={handleChange()}
                        >
                            {invoice.bill_from}
                        </address>
                    </div>
                    <article>
                        <div style={{ float: "left", width: "20%" }}>
                            <p>Bill To:</p>
                            <div
                                contentEditable={true}
                                suppressContentEditableWarning={true}
                            >
                                <select
                                    name="client_id"
                                    onChange={onChange}
                                    value={invoice.client_id}
                                    className="form-control"
                                >
                                    <option value="">Select Client</option>
                                    {clientList}
                                </select>
                                <p className="mt-2">
                                    {invoice.bill_to.address}
                                </p>
                            </div>
                        </div>
                        <div className="invoice-table">
                            <div style={{ float: "right", width: "80%" }}>
                                <table className="meta">
                                    <tbody>
                                        <tr>
                                            <th>
                                                <span
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Invoice #
                                                </span>
                                            </th>
                                            <td>
                                                <span
                                                    contentEditable={true}
                                                    name="number"
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                    onBlur={handleChange(null)}
                                                >
                                                    {invoice.number}
                                                </span>
                                            </td>
                                        </tr>
                                        <tr>
                                            <th>
                                                <span
                                                    contentEditable={true}
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
                                                    contentEditable={true}
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
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                >
                                                    Amount Due
                                                </span>
                                            </th>
                                            <td>
                                                <span
                                                    contentEditable={true}
                                                    suppressContentEditableWarning={
                                                        true
                                                    }
                                                    onBlur={e =>
                                                        setCurrencySign(
                                                            e.target.innerText
                                                        )
                                                    }
                                                >
                                                    {currencySign}
                                                </span>
                                                <span id="amount_due">
                                                    {total}
                                                </span>
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
                                                contentEditable={true}
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Item
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                contentEditable={true}
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Quantity / Hours
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                contentEditable={true}
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Rate
                                            </span>
                                        </th>
                                        <th>
                                            <span
                                                contentEditable={true}
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
                                                    className="cut"
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
                                                >
                                                    {row.item}
                                                </span>
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
                                                    name="rate"
                                                    onBlur={handleChange(index)}
                                                >
                                                    {row.rate}
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
                            <a className="add" onClick={addRow}>
                                +
                            </a>
                            <table className="balance">
                                <tbody>
                                    <tr>
                                        <th>
                                            <span
                                                contentEditable={true}
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
                                            <span>{total}</span>
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>
                                            <span
                                                contentEditable={true}
                                                suppressContentEditableWarning={
                                                    true
                                                }
                                            >
                                                Amount Paid
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
                                            >
                                                0.00
                                            </span>
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
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
                                value={invoice.notes}
                            />
                        </div>
                    </aside>
                    <div className="form-group text-right">
                        <button
                            type="button"
                            onClick={saveInvoice}
                            className="btn btn--prime mr-1">
                            Save & Download
                          </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
};

export default AddInvoices;