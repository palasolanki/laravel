import React, { useState, Fragment, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';

const AddClient = (props) => {
    const initialFormState = { name: '', company_name: '', country: '' }

    const [client, setClient] = useState(initialFormState)
    const [sendRequest, setSendRequest] = useState(false)


    const handleInputChange = event => {
        const { name, value } = event.target
        setClient({ ...client, [name]: value })
    }
    const submitForm = event => {
        event.preventDefault()

        if (!client.name || !client.company_name, !client.country) return
        setSendRequest(true)

    }

    const addClient = () => {
        return api.post('/addClient', client)
            .then((res) => {
                props.history.push('/clients');
                ToastsStore.success(res.data.message);
            })
            .catch((err) => {
                console.log(err)
            })
    }

    useEffect(() => {
        if (!sendRequest) return
        addClient()
    })

    return (
        <Fragment>
            <div className="bg-white">
                <h2>Add Client</h2>
                <form onSubmit={submitForm} method="post" className="form-horizontal">
                    <div className="form-group">
                        <label className="control-label col-sm-2" htmlFor="name">Name:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="Enter Name" name="name" value={client.name} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2" htmlFor="company_name">Company Name:</label>
                        <div className="col-sm-10">
                            <input type="text" className="form-control" placeholder="Enter Company Name" name="company_name" value={client.company_name} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-sm-2" htmlFor="country">Country:</label>
                        <div className="col-sm-10">
                            <select className="form-control" name="country" value={client.country} onChange={handleInputChange}>
                                <option value="" disabled>Country</option>
                                <option value="India">India</option>
                                <option value="USA">USA</option>
                                <option value="Canada">Canada</option>
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div className="col-sm-offset-2 col-sm-10">
                            <button type="submit" className="btn btn--prime">Save</button>&nbsp;
                            <Link to="/clients" className="btn btn--cancel">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div></Fragment>);
}


export default AddClient