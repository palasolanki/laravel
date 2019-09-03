import React, { Component } from 'react';
import AddClient from './AddClient';
import { Link, Route } from "react-router-dom";

class ClientList extends Component {
    constructor(props) {
        super(props);
        this.clientList = [
            { id: 1, name: 'aaa', company_name: 'a1', country: 'india' },
            { id: 2, name: 'bbb', company_name: 'a2', country: 'india' }
        ];
    }
    render() {
        return (
            <div className="bg-white">
                <h2>Client</h2>
                <button className="btn btn-sm btn--prime"><Link to="/addClient">New Client</Link></button>
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
                        {this.clientList.length > 0 ? (this.clientList.map((client, id) => (
                            <tr key={client.id}>
                                <td>{id + 1}</td>
                                <td>{client.name}</td>
                                <td>{client.company_name}</td>
                                <td>{client.country}</td>
                                <td>
                                    <button className="btn btn-sm btn--prime">Edit</button>&nbsp;
                                    <button className="btn btn-sm btn--cancel">Delete</button>
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
        );
    }
}

export default ClientList
