import React, { Fragment, useState } from "react";
import DatePicker from "react-datepicker";
import api from "../../helpers/api";
import Select from "react-select";
import { ToastsStore } from "react-toasts";

function EditExpenses(props) {
    const selectedFile = props.currentExpense.file_attachments
        ? props.currentExpense.file_attachments
        : [];
    const [fileAttachments, setFileAttachments] = useState(selectedFile);
    const { mediums, options } = props;
    const closeModalSpanStyle = {
        color: "#000",
        float: "right",
        fontSize: "20px",
        cursor: "pointer"
    };
    const tmpTagsList = data => {
        const tmpTagOptions = data.map(value => {
            return {
                value: value._id,
                label: value.tag
            };
        });
        return tmpTagOptions;
    };
    const editData = {
        id: props.currentExpense._id,
        date: new Date(props.currentExpense.selectedDateForEdit),
        item: props.currentExpense.item,
        amount: props.currentExpense.amount,
        medium: props.currentExpense.medium.id,
        tags: tmpTagsList(props.currentExpense.tags),
        file_attachments: selectedFile,
        notes: props.currentExpense.notes
    };

    const [expense, setExpense] = useState(editData);
    const handleInputChange = event => {
        const { name, value } = event.target;
        setExpense({ ...expense, [name]: value });
    };
    const handleFileChange = event => {
        setExpense({ ...expense, [event.target.name]: event.target.files[0] });
    };
    const handleDateChange = event => {
        setExpense({ ...expense, ["date"]: event });
    };
    const handleSelectChange = event => {
        const tmp = event
            ? event.map(value => {
                  return value["value"];
              })
            : [];
        setExpense({
            ...expense,
            ["tags"]: event ? event : [],
            ["tagsArray"]: event ? tmp : []
        });
    };
    const mediumList =
        mediums &&
        mediums.map((medium, key) => {
            return (
                <option value={medium._id} key={key}>
                    {medium.medium}
                </option>
            );
        });

    const deleteExpenseFile = (expenseId, deleteFile) => {
        api.delete(`/expenses/file_attachment/${deleteFile}/${expenseId}`).then(
            res => {
                setFileAttachments(
                    fileAttachments.filter(
                        expenseFile => expenseFile.filename !== deleteFile
                    )
                );
                ToastsStore.error(res.data.message);
            }
        );
    };
    const deleteFileDiv = {
        width: "100%",
        background: "#e8e8e8",
        padding: "10px",
        borderRadius: "5px",
        margin: "5px 0px"
    };
    const deleteFileCross = {
        paddingLeft: "10px",
        cursor: "pointer",
        float: "right",
        borderLeft: "1px solid #000",
        color: "#000"
    };
    return (
        <Fragment>
            <div
                className="modal"
                style={{
                    display: "block",
                    transition: "display 1s",
                    overflow: "auto"
                }}
            >
                <div className="modal-dialog register-modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h3 className="heading">Edit Expense</h3>
                            <div className="gradient_border-2">
                                <span
                                    onClick={props.handleCloseEdit}
                                    style={closeModalSpanStyle}
                                >
                                    X
                                </span>
                            </div>
                        </div>
                        <div className="modal-body">
                            {props.errors.length > 0 && (
                                <div className="alert alert-danger pb-0">
                                    {props.errors.map((value, key) => (
                                        <p key={key}>{value}</p>
                                    ))}
                                </div>
                            )}
                            <form
                                onSubmit={event => {
                                    event.preventDefault();
                                    props.updateExpense(
                                        props.currentExpense._id,
                                        [expense]
                                    );
                                }}
                            >
                                <div className="form-group">
                                    <label>Date:</label>
                                    <DatePicker
                                        name="date"
                                        className="form-control"
                                        selected={expense.date}
                                        onChange={handleDateChange}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Item:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Item"
                                        name="item"
                                        value={expense.item}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Amount:</label>
                                    <input
                                        type="number"
                                        className="form-control"
                                        placeholder="Enter Amount"
                                        name="amount"
                                        value={expense.amount}
                                        onChange={handleInputChange}
                                        min="1"
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Medium:</label>
                                    <select
                                        className="form-control"
                                        name="medium"
                                        onChange={handleInputChange}
                                        value={expense.medium}
                                    >
                                        <option value="">Select Type</option>
                                        {mediumList}
                                    </select>
                                </div>
                                <div className="form-group pt-1">
                                    <label>Tags:</label>

                                    <Select
                                        value={expense.tags}
                                        onChange={handleSelectChange}
                                        isMulti
                                        options={options}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Notes:</label>
                                    <textarea
                                        style={{ resize: "none" }}
                                        className="form-control"
                                        placeholder="Enter Notes"
                                        name="notes"
                                        onChange={handleInputChange}
                                        value={expense.notes || ""}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>File:</label>
                                    <br />
                                    {fileAttachments.map(
                                        (expenseFiles, key) => (
                                            <div
                                                style={deleteFileDiv}
                                                key={key}
                                            >
                                                <span>
                                                    {expenseFiles.filename}
                                                </span>
                                                <span
                                                    style={deleteFileCross}
                                                    onClick={() =>
                                                        deleteExpenseFile(
                                                            editData.id,
                                                            expenseFiles.filename
                                                        )
                                                    }
                                                >
                                                    X
                                                </span>
                                            </div>
                                        )
                                    )}
                                    <input
                                        type="file"
                                        name="file"
                                        onChange={handleFileChange}
                                    />
                                </div>

                                <div className="form-group text-right">
                                    <button
                                        type="submit"
                                        className="btn btn--prime mr-1"
                                    >
                                        Submit
                                    </button>
                                    <button
                                        onClick={props.handleCloseEdit}
                                        className="btn btn--cancel ml-1"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="modal-backdrop show" />
        </Fragment>
    );
}

export default EditExpenses;
