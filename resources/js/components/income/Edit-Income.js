import React, { Component, Fragment, useState } from 'react'
import DatePicker from "react-datepicker";

function EditIncome(props) {

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
    const editData = {
        date: new Date(props.currentIncome.date),
        client: props.currentIncome.client,
        amount: props.currentIncome.amount,
        medium: props.currentIncome.medium,
    }
    const [income, setIncome] = useState(editData)
    const handleInputChange = event => {
        const { name, value } = event.target
        setIncome({ ...income, [name]: value })
    }
    const handleDateChange = event => {
        setIncome({ ...income, ['date']: event })
    }
    const mediumList = Object.keys(props.mediums).map((key) => {
        return <option value={key} key={key}>{props.mediums[key]}</option>
    })
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
                        <h3>Edit Income</h3>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={event => {
                                event.preventDefault()
                                props.updateIncome(props.currentIncome._id, [income])
                            }}
                        >
                            <div className="form-group">
                                <label>Date:</label>
                                <DatePicker
                                    name="date"
                                    selected={income.date}
                                    onChange={handleDateChange}
                                />
                            </div>
                            <div className="form-group">
                                <label>Client:</label>
                                <select className="form-control" name="client" onChange={handleInputChange} value={income.client}>
                                    <option value="">Select Type</option>
                                    {
                                        props.clients.map((client, index) =>
                                            <option value={client._id} key={index}>{client.name}</option>
                                        )
                                    }
                                </select>
                            </div>
                            <div className="form-group">
                                <label>Amount:</label>
                                <input type="text" className="form-control" placeholder="Enter Amount" name="amount" value={income.amount} onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Medium:</label>
                                <select className="form-control" name="medium" onChange={handleInputChange} value={income.medium}>
                                    <option value="">Select Type</option>
                                    {
                                        mediumList
                                    }
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

export default EditIncome