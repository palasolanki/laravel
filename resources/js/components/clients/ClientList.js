import React, { useState, Fragment,useEffect } from 'react';
import { Link } from "react-router-dom";
import AddClient from "./AddClient";
import api from '../../helpers/api';

const ClientList = () => {

    const clientList = [
        { id: 1, name: 'aaa', company_name: 'a1', country: 'india' },
        { id: 2, name: 'bbb', company_name: 'a2', country: 'india' }
    ];
    
    const [clients, setClient] = useState(clientList);

    // useEffect(()=>{
    //     return api.get('/clients')
    //     .then((res) => {
    //         console.log(res)
    //     })
    //     .catch((err) => {
    //         console.log(err)
    //     })
    // })

    const deleteClient = id => {
        setClient(clients.filter(client => client.id !== id))
    }

    return (
        <Fragment>
            <div className="bg-white">
                <h2>Client</h2>
                <Link to="/addClient" params={{ clients: clients }} className="btn btn-sm btn--prime">New Client</Link>
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
                            <tr key={client.id}>
                                <td>{id + 1}</td>
                                <td>{client.name}</td>
                                <td>{client.company_name}</td>
                                <td>{client.country}</td>
                                <td>
                                    <button className="btn btn-sm btn--prime">Edit</button>&nbsp;
                                    <button className="btn btn-sm btn--cancel" onClick ={()=>deleteClient(client.id)}>Delete</button>
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
