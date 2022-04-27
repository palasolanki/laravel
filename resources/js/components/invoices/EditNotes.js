import React, { Fragment, useState } from "react";

function EditNotes(props) {
    const closeModalSpanStyle = {
        color: "#000",
        float: "right",
        fontSize: "20px",
        cursor: "pointer"
    };

    const [notes, setNotes] = useState(props.currentNotes);

    const handleInputChange = event => {
        const { name, value } = event.target;

        setNotes({ ...notes, [name]: value });
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
                <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header align-items-center">
                            <h3 className="heading mb-0">Edit Notes</h3>
                            <div className="gradient_border-2">
                                <span
                                    onClick={props.handleCloseEditNotesModal}
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
                                    props.updateNotes(notes);
                                }}
                            >
                                <div className="form-group">
                                    <label>Notes:</label>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        placeholder="Enter Notes"
                                        name="notes"
                                        value={notes.notes || ''}
                                        onChange={handleInputChange}
                                    />
                                </div>
                                
                                <div className="form-group text-right">
                                    <button
                                        type="submit"
                                        className="btn btn--prime mr-1"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={props.handleCloseEditNotesModal}
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

export default EditNotes;
