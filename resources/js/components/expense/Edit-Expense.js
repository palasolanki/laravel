import React, { Component, Fragment, useState } from 'react'
import DatePicker from "react-datepicker";

function EditExpenses(props) {

    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        padding: '10px 15px',
        fontSize: '20px',
        cursor: 'pointer'
      };
      const modalHeader = {
        textAlign: 'center',
      };

    const [expense, setExpense] = useState(props.currentExpense)

    const handleInputChange = event => {
        const { name, value } = event.target
        console.log(name);

        setExpense({ ...expense, [name]: value })
    }
    const handleDateChange = event => {
        console.log(event, expense);
        setExpense({ ...expense, ['date']: event })
    }
    return (
        <Fragment>
        <div
            className="modal"
            style={{ display: "block", transition: 'display 1s' }}
        >
            <div className="modal-dialog register-modal-dialog">
                <div className="modal-content gradient_border modal-background">
                    <div className="gradient_border-2">
                        <span onClick={props.handleCloseEdit} style={closeModalSpanStyle}>X</span>
                    </div>
                    <div style={modalHeader}>
                        <h3>Edit Expense</h3>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={event => {
                                event.preventDefault()

                                props.updateExpense(expense._id, expense)
                            }}
                        >
                            <div className="form-group">
                                <label>Date:</label>
                                <DatePicker
                                    name="date"
                                    selected={expense.date}
                                    onChange={handleDateChange}
                                />
                            </div>
                            {/* <div className="form-group">
                                <label>Date:</label>
                                <input type="text" className="form-control" name="date" value={expense.date.date} onChange={handleInputChange} />
                            </div> */}
                            <div className="form-group">
                                <label>Item:</label>
                                <input type="text" className="form-control" placeholder="Enter Item" name="item" value={expense.item} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Amount:</label>
                                <input type="text" className="form-control" placeholder="Enter Amount" name="amount" value={expense.amount} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Medium:</label>
                                <select className="form-control" name="medium" onChange={handleInputChange} value={expense.medium}>
                                    <option value="">Select Type</option>
                                    <option value="Hindi">Hindi</option>
                                    <option value="Guj">Guj</option>
                                </select>
                            </div>
                            <div className="form-group">
                                <button type="submit" style={{ margin: '0 10px 0 0' }} className="btn btn-success">Submit</button>
                                <button onClick={props.handleCloseEdit} className="btn btn-danger">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-backdrop show" />
        </Fragment>
    )
}

export default EditExpenses