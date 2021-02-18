import React, { useState, Fragment, useEffect } from 'react';

const Invoices = () => {

    const initialRow = {
        item: '',
        hours: '10',
        rate: 2,
        amount: ''
    }

    const [tableData, setTableData] = useState([initialRow]);
    const [deatils, setDetails] = useState({
        total: 40.00,
    })

    const keyUP = () => {
        setAmount()
    }
    useEffect(() => {
        setAmount()
    }, [])

    const setAmount = () => {
        if (tableData.length === 0) return;
        const modifiedArr = tableData.map(item => {
            let modifiedItem = Object.assign({}, item);
            return { ...modifiedItem, amount: modifiedItem.hours * modifiedItem.rate };
        });
        setTableData([...modifiedArr])
    }
    const addRow = () => {
        setTableData([...tableData, initialRow]);
    }

    const removeRow = (index) => {
        var array = [...tableData];
        array.splice(index, 1);
        setTableData([...array]);
    }
    return (
        <Fragment>
            <div className="invoice-form">
                <div className="invoice-body">
                    <div className="invoice-header">
                        <h1 className="invoice-h1">Invoice</h1>
                        <address contentEditable={true} suppressContentEditableWarning={true}>
                            <p>Radicalloop Technolabs LLP,</p>
                            <p>India</p>
                            <p>GST No.: 24AAUFR2815E1Z6</p>
                        </address>
                    </div>
                    <article>
                        <div style={{ float: 'left', width: '20%' }}>
                            <p>Bill To:</p><br />
                            <div contentEditable={true} suppressContentEditableWarning={true}>
                                <p>John Doe,</p>
                                <p>Good Company,</p>
                                <p>USA</p>
                            </div>
                        </div>
                        <div className="invoice-table">
                            <div style={{ float: 'right', width: '80%' }}>
                                <table className="meta">
                                    <tbody>
                                        <tr>
                                            <th><span contentEditable={true} suppressContentEditableWarning={true}>Invoice #</span></th>
                                            <td><span contentEditable={true} suppressContentEditableWarning={true}>101138</span></td>
                                        </tr>
                                        <tr>
                                            <th><span contentEditable={true} suppressContentEditableWarning={true}>Date</span></th>
                                            <td><span contentEditable={true} suppressContentEditableWarning={true}>January 1, 2012</span></td>
                                        </tr>
                                        <tr>
                                            <th><span contentEditable={true} suppressContentEditableWarning={true}>Due Date</span></th>
                                            <td><span contentEditable={true} suppressContentEditableWarning={true}>January 10, 2012</span></td>
                                        </tr>
                                        <tr>
                                            <th><span contentEditable={true} suppressContentEditableWarning={true}>Amount Due</span></th>
                                            <td><span id="prefix" contentEditable={true} suppressContentEditableWarning={true}>$</span><span id="amount_due">{deatils.total}</span></td>
                                        </tr>

                                    </tbody>
                                </table>
                            </div>
                            <table className="inventory">

                                <tbody>
                                    <tr>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Item</span></th>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Quantity / Hours</span></th>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Rate</span></th>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Amount</span></th>
                                    </tr>

                                    {tableData.map((row, index) =>
                                    (<tr key={index}>
                                        <td><a className="cut" onClick={() => removeRow(index)}>-</a><span contentEditable={true} suppressContentEditableWarning={true}>{row.item}</span></td>
                                        <td><span contentEditable={true} suppressContentEditableWarning={true}
                                            onKeyUp={keyUP}
                                        >{row.hours}</span></td>
                                        <td><span data-prefix>$</span>
                                            <span contentEditable={true} suppressContentEditableWarning={true}
                                                onKeyUp={keyUP}
                                            >{row.rate}</span></td>
                                        <td><span data-prefix>$</span><span>{row.amount}</span></td>
                                    </tr>)
                                    )}
                                </tbody>
                            </table>
                            <a className="add" onClick={addRow}>+</a>
                            <table className="balance">
                                <tbody>
                                    <tr>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Total</span></th>
                                        <td><span data-prefix>$</span><span>40.00</span></td>
                                    </tr>
                                    <tr>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Amount Paid</span></th>
                                        <td><span data-prefix>$</span><span contentEditable={true} suppressContentEditableWarning={true}>0.00</span></td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </article>
                    <aside>
                        <h1><span contentEditable={true} suppressContentEditableWarning={true}>Notes</span></h1>
                        <div contentEditable={true} suppressContentEditableWarning={true}>
                            <p>The currency is US Dollar.</p>
                        </div>
                    </aside>
                </div>
            </div>
        </Fragment>
    );
}

export default Invoices
