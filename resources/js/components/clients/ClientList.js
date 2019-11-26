import React, { useState, Fragment, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from '../../helpers/api';

const ClientList = () => {

    const [clients, setClient] = useState([]);

    const [mount, setMount] = useState(true);

    const [deleteRequest, setDeleteRequest] = useState(false);

    const [clientID, setClientId] = useState(null)

    useEffect(() => {
        if (!mount) return
        const fetchData = async () => {
            await api.get('/clients')
                .then((res) => {
                    setClient(res.data.data)
                    setMount(false)
                }).catch((err) => {
                    console.log(err)
                });
        };
        fetchData();
    }, [mount]);

    const deleteClientData = id => {
        return api.delete(`/client/${id}`, id)
            .then((res) => {
                setDeleteRequest(false)
                setMount(true)
            })
            .catch((err) => {
                console.log(err)
            })
    }

    const deleteClient = (id) => {
        event.preventDefault()
        setDeleteRequest(true)
        setClientId(id)
    }

    return (
        <Fragment>
            <div className="bg-white">
                {deleteRequest &&
                    <div className="modal show" style={{ display: "block" }}>
                        <div className="modal-dialog" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title">Are you sure?</h5>
                                    <button type="button" onClick={() => setDeleteRequest(false)} className="close" data-dismiss="modal" aria-label="Close">
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-footer">
                                    <button type="button" onClick={() => deleteClientData(clientID)} className="btn btn-sm btn--prime">Yes</button>
                                    <button type="button" onClick={() => setDeleteRequest(false)} className="btn btn-sm btn--cancel" data-dismiss="modal">No</button>
                                </div>
                            </div>
                        </div>
                    </div>}
                <h2>Clients</h2>
                <Link to="/addClient" className="btn btn-sm btn--prime">New Client</Link>
                <table className="table">
                    <thead className="thead-light">
                        <tr>
                            <th >#</th>
                            <th>Name</th>
                            <th>Company</th>
                            <th>Country</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {clients.length > 0 ? (clients.map((client, id) => (
                            <tr key={client._id}>
                                <td>{id + 1}</td>
                                <td>{client.name}</td>
                                <td>{client.company_name}</td>
                                <td>{client.country}</td>
                                <td>
                                    <Link to={`editClient/${client._id}`} className="btn btn-sm btn--prime">Edit</Link>&nbsp;
                                    <button className="btn btn-sm btn--cancel" onClick={() => deleteClient(client._id)}>Delete</button>
                                </td>
                            </tr>
                        ))) : (
                                <tr>
                                    <td colSpan={3}>No clients</td>
                                </tr>
                            )}
                    </tbody>
                </table>
            </div>
        </Fragment>
    );
}

export default ClientList
