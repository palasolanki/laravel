import React, { Component, Fragment, useState, useEffect } from "react";
import api from "../../helpers/api";
import { Link } from "react-router-dom";
// import { Switch, Route } from "react-router-dom";
// import { Link, Route } from "react-router-dom";
// import Modal from 'react-bootstrap-modal';
import AddTags from "./Add-Tags";
import EditTags from "./Edit-Tags";
import { ToastsStore } from "react-toasts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";

function Tags() {
    //For modal open/close
    const [showAddModal, setShow] = useState(false);
    const [showEditModal, setEditShow] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleCloseEdit = () => setEditShow(false);
    const handleCloseDelete = () => setDeleteShow(false);

    const openShow = () => setShow(true);
    const openShowEdit = () => setEditShow(true);
    const openShowDelete = () => setDeleteShow(true);
    const [errors, setErrors] = useState([]);

    //For get tags from server and display list of tags
    const tagsData = [];

    const [tags, setTags] = useState(tagsData);
    useEffect(() => {
        api.get("/tags")
            .then(res => {
                setTags(res.data);
            })
            .catch(res => {});
    }, []);

    //For add new tag in database
    const addTag = tag => {
        api.post(`/tags`, tag).then(res => {
            setTags([...tags, res.data.addedTag]);
            ToastsStore.success(res.data.message);
            handleClose();
        });
    };

    //For delete tag
    const [deleteTagId, setDeleteTagId] = useState();

    const setDeleteTagIdFunction = currentDeleteTagId => {
        setDeleteTagId(currentDeleteTagId);
        openShowDelete();
    };

    const deleteTag = tagId => {
        api.delete(`/tags/${tagId}`).then(res => {
            setTags(tags.filter(tag => tag._id !== tagId));
            ToastsStore.success(res.data.message);
            handleCloseDelete();
        });
    };

    //For open edit modal with auto filled input field
    const [currentTag, setCurrentTag] = useState();

    const editRow = tag => {
        setErrors([]);
        setCurrentTag(tag);
        openShowEdit();
    };

    //For update data in database and display in list.
    const updateTag = (tagId, updatedTag) => {
        api.patch(`/tags/${tagId}`, updatedTag)
            .then(res => {
                setTags(
                    tags.map(tag =>
                        tag._id === tagId ? res.data.updatedTag : tag
                    )
                );
                ToastsStore.success(res.data.message);
                handleCloseEdit();
            })
            .catch(res => {
                const tmp = res.response.data.errors;
                for (const key in tmp) {
                    if (!errors.includes(tmp[key][0])) {
                        errors.push(tmp[key][0]);
                    }
                }
                setErrors([...errors]);
            });
    };

    return (
        <div className="bg-white p-3">
            <div className="d-flex align-items-center pb-2">
                <h2 className="heading">Tags</h2>
                <button
                    to="/"
                    className="btn btn--prime ml-auto"
                    onClick={openShow}
                >
                    <FontAwesomeIcon className="mr-2" icon={faPlus} />
                    Add Tag
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
                        <th>Tag</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.length > 0 ? (
                        tags.map(tag => (
                            <tr key={tag._id}>
                                <td>{tag.tag}</td>
                                <td>{tag.type}</td>
                                <td>
                                    <button
                                        className="btn btn-sm btn--prime"
                                        onClick={() => editRow(tag)}
                                    >
                                        Edit
                                    </button>
                                    &nbsp;
                                    <button
                                        className="btn btn-sm btn--cancel ml-1"
                                        onClick={() =>
                                            setDeleteTagIdFunction(tag._id)
                                        }
                                    >
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={3}>No Tags</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showAddModal && (
                <AddTags handleClose={handleClose} addTag={addTag} />
            )}
            {showEditModal && (
                <EditTags
                    handleCloseEdit={handleCloseEdit}
                    currentTag={currentTag}
                    updateTag={updateTag}
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
                                        Are you sure to delete this tag?
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
                                        onClick={() => deleteTag(deleteTagId)}
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

export default Tags;
