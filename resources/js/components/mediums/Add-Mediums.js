import React, { Component, Fragment, useState } from 'react'

function AddMediums(props) {

    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        padding: '0px 15px',
        fontSize: '20px',
        cursor: 'pointer'
      };
    //   const modalHeader = {
    //     textAlign: 'center',
    //   };

    const initialFormState = {}
    const [medium, setMedium] = useState(initialFormState)

    const handleInputChange = event => {
        const { name, value } = event.target

        setMedium({ ...medium, [name]: value })
    }

    return (
        <Fragment>
        <div style={{ display: 'block' }} className="modal">
            <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div className="modal-content gradient_border modal-background">
                    <div className="modal-header align-items-center">
                        <h2 className="heading mb-0">Add New Medium</h2>
                        <div className="gradient_border-2">
                            <span onClick={props.handleClose} style={closeModalSpanStyle}>X</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={event => {
                                event.preventDefault()
                                if (!medium.medium || !medium.type) return

                                props.addMedium(medium)
                                setMedium(initialFormState)
                            }}
                        >
                            <div className="form-group">
                                <label>Medium Name:</label>
                                <input type="text" className="form-control" id="medium" placeholder="Enter Medium" name="medium" onChange={handleInputChange} />
                            </div>
                            <div className="form-group">
                                <label>Type:</label>
                                <select className="form-control" id="type" name="type" onChange={handleInputChange} >
                                    <option value="">Select Type</option>
                                    <option value="expense">Expense</option>
                                    <option value="income">Income</option>
                                </select>
                            </div>
                            <div className="form-group text-right">
                                <button type="submit" style={{ margin: '0 10px 0 0' }} className="btn btn--prime">Submit</button>
                                <button onClick={props.handleClose} className="btn btn--cancel">Cancel</button>
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

export default AddMediums