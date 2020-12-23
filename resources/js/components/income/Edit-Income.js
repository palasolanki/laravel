import React, { Fragment, useState } from 'react'
import DatePicker from "react-datepicker";
import Select from 'react-select';

function EditIncome(props) {
    const {clients, mediums, tagOptions} = props;
    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        fontSize: '20px',
        cursor: 'pointer'
      };
      const tmpTagsList = (data) => {
        const tmpTagOptions = (data && data.length > 0) ? data.map(value => {
            return {
                value: value,
                label: value
            }
        }) : [];
        return tmpTagOptions;
    }
    const editData = {
        date: new Date(props.currentIncome.selectedDateForEdit),
        client_id: props.currentIncome.client_id,
        amount: props.currentIncome.amount,
        medium: props.currentIncome.medium,
        tags: tmpTagsList(props.currentIncome.tags),
        notes: props.currentIncome.notes,
    }
    const [income, setIncome] = useState(editData)
    const handleInputChange = event => {
        const { name, value } = event.target
        setIncome({ ...income, [name]: value })
    }
    const handleDateChange = event => {
        setIncome({ ...income, ['date']: event })
    }
    const handleSelectChange = event => {
        const tmp = event ? event.map(value => {
            return value['label'];
        }) : [];
        setIncome({
            ...income,
            ['tags']: (event) ? event : [],
            ['tagsArray']: (event) ? tmp : []
        })
    }
    const mediumList = mediums && Object.keys(mediums).map((key) => {
        return <option value={key} key={key}>{mediums[key]}</option>
    })
    return (
        <Fragment>
        <div
            className="modal"
            style={{ display: "block", transition: 'display 1s' }}
        >
            <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div className="modal-content">
                    <div className="modal-header align-items-center">
                        <h3 className="heading">Edit Income</h3>
                        <div className="gradient_border-2">
                            <span onClick={props.handleCloseEdit} style={closeModalSpanStyle}>X</span>
                        </div>
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
                                    className="form-control"
                                    selected={income.date}
                                    onChange={handleDateChange}
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>
                            <div className="form-group">
                                <label>Client:</label>
                                <select className="form-control" name="client_id" onChange={handleInputChange} value={income.client_id}>
                                    <option value="">Select Type</option>
                                    {
                                        clients && clients.map((client, index) =>
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
                            <div className="form-group pt-1">
                                <Select
                                    value={income.tags}
                                    onChange={handleSelectChange}
                                    isMulti
                                    options={tagOptions}
                                />
                            </div>
                            <div className="form-group">
                                <label>Notes:</label>
                                <textarea className="form-control" placeholder="Enter Notes" name="notes" onChange={handleInputChange} value={income.notes || ''} />
                            </div>
                            <div className="form-group text-right">
                                <button type="submit" className="btn btn--prime mr-1">Submit</button>
                                <button onClick={props.handleCloseEdit} className="btn btn--cancel ml-1">Cancel</button>
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