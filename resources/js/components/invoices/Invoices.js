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
        total: 0,
        numaber:0,
        date:'January 1, 2012',
        due_date:'January 10, 2012'
    })
    const [isCheckAmount,setCheckAmount] = useState(false);

    const handleChange = (index) => (e) => {
        let newArr = [...tableData];
        let name = e.target.getAttribute('name');
        newArr[index] =  { ...newArr[index] ,[name]: e.target.innerText };
        setTableData([...newArr]);

        if(name=='hours' || name=="rate")
        setCheckAmount(true);
    }
   
    useEffect(() => {
        setTotalAmount()
    }, [])

    useEffect(() => {
        if(!isCheckAmount) return;
        setTotalAmount()
    }, [isCheckAmount]);

    useEffect(() => {
        let obj = { ...deatils };
        obj.total = getTotalAmount()
        setDetails(obj);
    }, [tableData])

    const getTotalAmount = () => {
        return tableData.reduce(function (prev, cur) {
            return prev + cur.amount;
        }, 0);
    }

    const setTotalAmount = () => {
        if (tableData.length === 0) return;
        let modifiedArr = tableData.map(item => {
            let modifiedItem = Object.assign({}, item);
            return { ...modifiedItem, amount: modifiedItem.hours * modifiedItem.rate };
        });
        setTableData([...modifiedArr]);
        setCheckAmount(false);
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
                                            <td><span contentEditable={true} suppressContentEditableWarning={true}>{deatils.numaber}</span></td>
                                        </tr>
                                        <tr>
                                            <th><span contentEditable={true} suppressContentEditableWarning={true}>Date</span></th>
                                            <td><span contentEditable={true} suppressContentEditableWarning={true}>{deatils.date}</span></td>
                                        </tr>
                                        <tr>
                                            <th><span contentEditable={true} suppressContentEditableWarning={true}>Due Date</span></th>
                                            <td><span contentEditable={true} suppressContentEditableWarning={true}>{deatils.due_date}</span></td>
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
                                        <td>
                                            <a className="cut" onClick={() => removeRow(index)}>-</a>
                                            <span contentEditable={true}
                                                suppressContentEditableWarning={true}
                                                name="item"
                                                onKeyUp={handleChange(index)}>
                                                {row.item}
                                            </span>
                                        </td>

                                        <td>
                                            <span contentEditable={true} suppressContentEditableWarning={true}
                                                // onKeyDown={keyDown}
                                                name="hours"
                                                onKeyUp={handleChange(index)}>
                                                {row.hours}
                                            </span>
                                        </td>
                                        <td>
                                            <span data-prefix>$</span>
                                            <span contentEditable={true}
                                                suppressContentEditableWarning={true}
                                                // onKeyDown={keyDown}
                                                name="rate"
                                                onKeyUp={handleChange(index)}>
                                                {row.rate}
                                            </span>
                                        </td>
                                        <td>
                                            <span data-prefix>$</span>
                                            <span>{row.amount}</span>
                                        </td>
                                    </tr>)
                                    )}
                                </tbody>
                            </table>
                            <a className="add" onClick={addRow}>+</a>
                            <table className="balance">
                                <tbody>
                                    <tr>
                                        <th><span contentEditable={true} suppressContentEditableWarning={true}>Total</span></th>
                                        <td><span data-prefix>$</span><span>{deatils.total}</span></td>
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
