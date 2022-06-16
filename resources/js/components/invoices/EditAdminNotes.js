import React, { Fragment, useState } from "react";

function EditAdminNotes(props) {
    const closeModalSpanStyle = {
        color: "#000",
        float: "right",
        fontSize: "20px",
        cursor: "pointer"
    };

    const [adminNotes, setAdminNotes] = useState(props.AdminNotes);

    const handleInputChange = event => {
        const { name, value } = event.target;

        setAdminNotes({ ...adminNotes, [name]: value });
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
                            <h3 className="heading mb-0">Edit Admin Notes</h3>
                            <div className="gradient_border-2">
                                <span
                                    onClick={props.closeEditAdminNotesModal}
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
                                    props.updateAdminNotes(adminNotes);
                                }}
                            >
                                <div className="form-group">
                                    <label>Admin Notes:</label>
                                    <textarea
                                        className="form-control"
                                        rows="6"
                                        placeholder="Enter Admin Notes"
                                        name="admin_notes"
                                        value={adminNotes.admin_notes || ''}
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

export default EditAdminNotes;
