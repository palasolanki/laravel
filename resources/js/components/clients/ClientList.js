import React, { useState, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";

const ClientList = () => {
    const [clients, setClient] = useState([]);

    const [mount, setMount] = useState(true);

    const [deleteRequest, setDeleteRequest] = useState(false);

    const [clientID, setClientId] = useState(null);

    useEffect(() => {
        if (!mount) return;
        const fetchData = async () => {
            await api
                .get("/clients")
                .then(res => {
                    setClient(res.data.data);
                    setMount(false);
                })
                .catch(err => {
                    console.log(err);
                });
        };
        fetchData();
    }, [mount]);

    const deleteClientData = id => {
        return api
            .delete(`/client/${id}`, id)
            .then(res => {
                setDeleteRequest(false);
                setMount(true);
                ToastsStore.success(res.data.message);
            })
            .catch(err => {
                console.log(err);
            });
    };

    const deleteClient = id => {
        event.preventDefault();
        setDeleteRequest(true);
        setClientId(id);
    };

    return (
        <Fragment>
            <div className="bg-white p-3">
                {deleteRequest && (
                    <div>
                        <div style={{ display: "block" }} className="modal">
                            <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                                <div
                                    className="modal-content"
                                    style={{ padding: "25px" }}
                                >
                                    <div className="text-center">
                                        <h3 className="heading">
                                            Are you sure you want to delete this
                                            Client?
                                        </h3>
                                    </div>
                                    <div
                                        style={{ textAlign: "center" }}
                                        className="modal-body"
                                    >
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setDeleteRequest(false)
                                            }
                                            className="btn mr-1 btn--prime"
                                            data-dismiss="modal"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                deleteClientData(clientID)
                                            }
                                            className="btn ml-1 btn--cancel"
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
                <div className="d-flex align-items-center pb-2">
                    <h2 className="heading">Clients</h2>
                    <Link to="/clients/add" className="btn btn--prime ml-auto">
                        <FontAwesomeIcon className="mr-2" icon={faPlus} /> Add
                        Client
                    </Link>
                </div>
                <div className="table-responsive">
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>#</th>
                                <th>Name</th>
                                <th>Company</th>
                                <th>Country</th>
                                <th>Payment Medium</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.length > 0 ? (
                                clients.map((client, index) => (
                                    <tr key={client._id}>
                                        <td>{index + 1}</td>
                                        <td>{client.name}</td>
                                        <td>{client.company_name 
                                                ? client.company_name 
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {client.country
                                                ? client.country.name
                                                : "N/A"}
                                        </td>
                                        <td>
                                            {client.medium
                                                ? client.medium.medium
                                                : "N/A"}
                                        </td>

                                        <td>
                                            <Link
                                                to={`editClient/${client._id}`}
                                                className="btn btn-sm btn--prime"
                                            >
                                                Edit
                                            </Link>
                                            &nbsp;
                                            <button
                                                className="btn btn-sm btn--cancel ml-1"
                                                onClick={() =>
                                                    deleteClient(client._id)
                                                }
                                            >
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={3}>No Clients</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </Fragment>
    );
};

export default ClientList;
