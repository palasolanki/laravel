import React, { Component, Fragment, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import api from '../../helpers/api';
import Select from 'react-select';
import {ToastsStore} from 'react-toasts';

function EditExpenses(props) {
    const [fileAttachments, setFileAttachments] = useState(props.currentExpense.file_attachments);
    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        fontSize: '20px',
        cursor: 'pointer'
    };
    const tmpTagsList = (data) => {
        const tmpTagOptions = data.map(value => {
            return {
                value: value,
                label: value
            }
        });
        return tmpTagOptions;
    }
    const editData = {
        id: props.currentExpense._id,
        date: new Date(props.currentExpense.date),
        item: props.currentExpense.item,
        amount: props.currentExpense.amount,
        medium: props.currentExpense.medium,
        tags: tmpTagsList(props.currentExpense.tags),
        tagsArray: props.currentExpense.tags,
        file_attachments: props.currentExpense.file_attachments
    }
    const [mediums, setMediums] = useState([]);
    const [options, setOptions] = useState([]);

    useEffect( () => {
        api.get('/getExpenseMediumList').then((res) => {
            if (res.data.medium) {
                setMediums(res.data.medium);
            }
        }),
        api.get('/getTagList').then((res) => {
            createTagOptions(res.data.tags);
        })
    }, [] );

    const [expense, setExpense] = useState(editData)
    const handleInputChange = event => {
        const { name, value } = event.target
        setExpense({ ...expense, [name]: value })
    }
    const handleFileChange = event => {
        setExpense({ ...expense, [event.target.name]:event.target.files[0] })
    }
    const handleDateChange = event => {
        setExpense({ ...expense, ['date']: event })
    }
    const handleSelectChange = event => {
        const tmp = event.map(value => {
            return value['label'];
        })
        setExpense({
            ...expense,
            ['tags']: (event) ? event : [],
            ['tagsArray']: (event) ? tmp : []
        })
    }
    const createTagOptions = data => {
        const tagOptions = data.map(value => {
            return {
                value: value,
                label: value
            }
        });
        setOptions(tagOptions);
    }
    const mediumList = mediums && Object.keys(mediums).map((key) => {
        return <option value={key} key={key}>{mediums[key]}</option>
    })

    const deleteExpenseFile = (expenseId,deleteFile) => {
        api.delete(`/expenses/file_attachment/${deleteFile}/${expenseId}`)
        .then((res) => {
            setFileAttachments(fileAttachments.filter(expenseFile => expenseFile.filename !== deleteFile));
            ToastsStore.error(res.data.message);
        })
    }
    const deleteFileDiv = {
        width: '100%',
        background: '#e8e8e8',
        padding: '10px',
        borderRadius: '5px',
        margin: '5px 0px',
    }
    const deleteFileCross = {
        paddingLeft: '10px',
        cursor: 'pointer',
        float: 'right',
        borderLeft: '1px solid #000',
        color: '#000',
    }
    return (
        <Fragment>
        <div
            className="modal"
            style={{ display: "block", transition: 'display 1s' }}
        >
            <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div className="modal-content">
                    <div className="modal-header align-items-center">
                        <h3 className="heading">Edit Expense</h3>
                        <div className="gradient_border-2">
                            <span onClick={props.handleCloseEdit} style={closeModalSpanStyle}>X</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={event => {
                                event.preventDefault()
                                props.updateExpense(props.currentExpense._id, [expense])
                            }}
                        >
                            <div className="form-group">
                                <label>Date:</label>
                                <DatePicker
                                    name="date"
                                    className="form-control"
                                    selected={expense.date}
                                    onChange={handleDateChange}
                                />
                            </div>
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
                                    {
                                        mediumList
                                    }
                                </select>
                            </div>
                            <div className="form-group pt-1">
                                <Select
                                    value={expense.tags}
                                    onChange={handleSelectChange}
                                    isMulti
                                    options={options}
                                />
                            </div>
                                <div className="form-group">
                                <label>File:</label>
                                    <br></br>
                                    { fileAttachments.map((expenseFiles, key) =>
                                        <div style={deleteFileDiv} key={key}>
                                            <span>{expenseFiles.filename}</span><span style={deleteFileCross}
                                            onClick={() => deleteExpenseFile(editData.id, expenseFiles.filename)}>X</span>
                                        </div>
                                    )}
                                    <input style={{paddingTop: "8px"}} type="file" name="file" onChange={handleFileChange}/>
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

export default EditExpenses