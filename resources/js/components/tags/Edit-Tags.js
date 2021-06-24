import React, { Component, Fragment, useState } from "react";

function EditTags(props) {
    const closeModalSpanStyle = {
        color: "#000",
        float: "right",
        fontSize: "20px",
        cursor: "pointer"
    };
    //   const modalHeader = {
    //     textAlign: 'center',
    //   };

    const [tag, setTag] = useState(props.currentTag);

    const handleInputChange = event => {
        const { name, value } = event.target;

        setTag({ ...tag, [name]: value });
    };

    return (
        <Fragment>
            <div
                className="modal"
                style={{ display: "block", transition: "display 1s" }}
            >
                <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h3 className="heading mb-0">Edit Tag</h3>
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
                            <form
                                onSubmit={event => {
                                    event.preventDefault();
                                    props.updateTag(tag._id, tag);
                                }}
                            >
                                <div className="form-group">
                                    <label>Tag Name:</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="tag"
                                        placeholder="Enter Tag"
                                        name="tag"
                                        value={tag.tag}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Type:</label>
                                    <select
                                        className="form-control"
                                        id="type"
                                        name="type"
                                        onChange={handleInputChange}
                                        value={tag.type}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="expense">Expense</option>
                                        <option value="income">Income</option>
                                    </select>
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

export default EditTags;
