import React, { Component, Fragment, useState, useEffect } from "react";
import api from "../../helpers/api";
import { Link } from "react-router-dom";
import AddMediums from "./Add-Mediums";
import EditMediums from "./Edit-Mediums";
import { ToastsStore } from "react-toasts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { errorResponse } from "../../helpers";

function Mediums() {
    //For modal open/close
    const [showAddModal, setShow] = useState(false);
    const [showEditModal, setEditShow] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleCloseEdit = () => setEditShow(false);
    const handleCloseDelete = () => setDeleteShow(false);

    const openShowEdit = () => setEditShow(true);
    const openShowDelete = () => setDeleteShow(true);
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(false);

    //For get mediums from server and display list of mediums
    const mediumsData = [];

    const openShow = () => {
        setErrors([]);
        setShow(true);
    };

    const [mediums, setMediums] = useState(mediumsData);
    useEffect(() => {
        api.get("/mediums")
            .then(res => {
                setMediums(res.data);
            })
            .catch(res => {});
    }, []);

    //For add new medium in database
    const addMedium = medium => {
        setDisabled(true);
        api.post(`/mediums`, medium)
            .then(res => {
                setDisabled(false);
                setMediums([...mediums, res.data.addedMedium]);
                ToastsStore.success(res.data.message);
                handleClose();
            })
            .catch(res => {
                setDisabled(false);
                errorResponse(res, setErrors);
            });
    };

    //For delete medium
    const [deleteMediumId, setDeleteMediumId] = useState();

    const setDeleteMediumIdFunction = currentDeleteMediumId => {
        setDeleteMediumId(currentDeleteMediumId);
        openShowDelete();
    };

    const deleteMedium = mediumId => {
        api.delete(`/mediums/${mediumId}`).then(res => {
            setMediums(mediums.filter(medium => medium._id !== mediumId));
            ToastsStore.success(res.data.message);
            handleCloseDelete();
        });
    };

    //For open edit modal with auto filled input field
    const [currentMedium, setCurrentMedium] = useState();

    const editRow = medium => {
        setErrors([]);
        setCurrentMedium(medium);
        openShowEdit();
    };

    //For update data in database and display in list.
    const updateMedium = (mediumId, updatedMedium) => {
        api.patch(`/mediums/${mediumId}`, updatedMedium)
            .then(res => {
                setMediums(
                    mediums.map(medium =>
                        medium._id === mediumId
                            ? res.data.updatedMedium
                            : medium
                    )
                );
                ToastsStore.success(res.data.message);
                handleCloseEdit();
            })
            .catch(res => {
                errorResponse(res, setErrors);
            });
    };

    return (
        <div className="bg-white p-3">
            <div className="d-flex align-items-center pb-2">
                <h2 className="heading">Mediums</h2>
                <button
                    to="/"
                    className="btn btn--prime ml-auto"
                    onClick={openShow}
                >
                    <FontAwesomeIcon className="mr-2" icon={faPlus} />
                    Add Medium
                </button>
            </div>
            <div className="container">
                <div className="modal fade" id="myModal" role="dialog">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <button
                                    type="button"
                                    className="close"
                                    data-dismiss="modal"
                                >
                                    &times;
                                </button>
                                <h4 className="modal-title">Modal Header</h4>
                            </div>
                            <div className="modal-body">
                                <p>Some text in the modal.</p>
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-default"
                                    data-dismiss="modal"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>Medium</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {mediums.length > 0 ? (
                        mediums.map(medium => (
                            <tr key={medium._id}>
                                <td>{medium.medium}</td>
                                <td>{medium.type}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn--prime"
                                        onClick={() => editRow(medium)}
                                    >
                                        Edit
                                    </button>
                                    &nbsp;
                                    <button
                                        className="btn btn-sm btn--cancel ml-1"
                                        onClick={() =>
                                            setDeleteMediumIdFunction(
                                                medium._id
                                            )
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No Mediums</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showAddModal && (
                <AddMediums
                    handleClose={handleClose}
                    addMedium={addMedium}
                    errors={errors}
                    disabled={disabled}
                />
            )}
            {showEditModal && (
                <EditMediums
                    handleCloseEdit={handleCloseEdit}
                    currentMedium={currentMedium}
                    updateMedium={updateMedium}
                    errors={errors}
                />
            )}
            {showDeleteModal && (
                <div>
                    <div style={{ display: "block" }} className="modal">
                        <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                            <div
                                style={{ padding: "25px" }}
                                className="modal-content gradient_border modal-background"
                            >
                                <div style={{ textAlign: "center" }}>
                                    <h3 className="heading">
                                        Are you sure to delete this medium?
                                    </h3>
                                </div>
                                <div
                                    style={{ textAlign: "center" }}
                                    className="modal-body"
                                >
                                    <button
                                        style={{ color: "#fff" }}
                                        className="btn btn--prime mr-1"
                                        onClick={handleCloseDelete}
                                    >
                                        Cancel
                                    </button>
                                    &nbsp;
                                    <button
                                        className="btn btn--cancel ml-1"
                                        onClick={() =>
                                            deleteMedium(deleteMediumId)
                                        }
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-backdrop show" />
                </div>
            )}
        </div>
    );
}

export default Mediums;
