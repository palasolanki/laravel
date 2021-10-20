import React, { Component, Fragment, useState } from "react";
import DatePicker from "react-datepicker";

function EditHardware(props) {
    const closeModalSpanStyle = {
        color: "#000",
        float: "right",
        // padding: '10px 15px',
        fontSize: "20px",
        cursor: "pointer"
    };
    // const modalHeader = {
    //     textAlign: 'center',
    // };
    const editData = {
        date: props.currentHardware.date
            ? new Date(props.currentHardware.date)
            : "",
        item: props.currentHardware.item,
        type: props.currentHardware.type,
        serial_number: props.currentHardware.serial_number
            ? props.currentHardware.serial_number
            : "",
        status: props.currentHardware.status,
        notes: props.currentHardware.notes
    };
    const [hardware, setHardware] = useState(editData);
    const handleInputChange = event => {
        const { name, value } = event.target;
        setHardware({ ...hardware, [name]: value });
    };
    const handleDateChange = event => {
        setHardware({ ...hardware, ["date"]: event });
    };
    const typeList =
        props.types &&
        Object.keys(props.types).map(key => {
            return (
                <option value={key} key={key}>
                    {props.types[key]}
                </option>
            );
        });
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
                <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h3 className="heading">Edit Hardware</h3>
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
                            {props.errors && props.errors.length > 0 && (
                                <div className="alert alert-danger pb-0">
                                    {props.errors.map((value, key) => (
                                        <p key={key}>{value}</p>
                                    ))}
                                </div>
                            )}
                            <form
                                onSubmit={event => {
                                    event.preventDefault();
                                    props.updateHardware(
                                        props.currentHardware._id,
                                        [hardware]
                                    );
                                }}
                            >
                                <div className="form-group">
                                    <label>Date:</label>
                                    <DatePicker
                                        name="date"
                                        className="form-control"
                                        selected={hardware.date}
                                        onChange={handleDateChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Item:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Item"
                                        name="item"
                                        value={hardware.item}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select
                                        className="form-control"
                                        name="type"
                                        onChange={handleInputChange}
                                        value={hardware.type}
                                    >
                                        <option value="">Select Type</option>
                                        {typeList}
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Serial Number:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Serial Number"
                                        name="serial_number"
                                        value={hardware.serial_number}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Status:</label>
                                    <select
                                        className="form-control"
                                        name="status"
                                        onChange={handleInputChange}
                                        value={hardware.status}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="in_use">In-use</option>
                                        <option value="spare">Spare</option>
                                        <option value="needs_repair">
                                            Needs-Repair
                                        </option>
                                    </select>
                                </div>
                                <div className="form-group">
                                    <label>Notes:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter Notes"
                                        name="notes"
                                        value={hardware.notes}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group text-right">
                                    <button
                                        type="submit"
                                        style={{ margin: "0 10px 0 0" }}
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

export default EditHardware;
