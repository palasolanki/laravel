import React, { useState, Fragment, useEffect } from 'react';
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';

const AddClient = (props) => {
    const initialFormState = { name: '', company_name: '', country_id: '' }

    const [client, setClient] = useState(initialFormState)
    const [countries, setCountries] = useState([])
    const [sendRequest, setSendRequest] = useState(false)

    useEffect( () => {
        api.get('/countries').then((res) => {
            setCountries(res.data.country);
        })
    }, [] );

    const handleInputChange = event => {
        const { name, value } = event.target
        setClient({ ...client, [name]: value })
    }
    const submitForm = event => {
        event.preventDefault()

        if (!client.name || !client.company_name, !client.country_id) return
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
            <div className="bg-white p-3">
                <h2 className="heading mb-3">Add Client</h2>
                <form onSubmit={submitForm} method="post" className="form-horizontal col-lg-6 col-12 px-0">
                    <div className="form-group">
                        <label className="control-label col-auto px-0" htmlFor="name">Name:</label>
                        <div className="col-sm-10 pl-0">
                            <input type="text" className="form-control" placeholder="Enter Name" name="name" value={client.name} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-auto px-0" htmlFor="company_name">Company Name:</label>
                        <div className="col-sm-10 pl-0">
                            <input type="text" className="form-control" placeholder="Enter Company Name" name="company_name" value={client.company_name} onChange={handleInputChange} />
                        </div>
                    </div>
                    <div className="form-group">
                        <label className="control-label col-auto px-0" htmlFor="countryid">Country:</label>
                        <div className="col-sm-10 pl-0">
                            <select className="form-control" name="country_id" value={client.country_id} onChange={handleInputChange}>
                                <option value="" disabled>Country</option>
                                {
                                    countries.map(value => {
                                        return <option value={value._id} key={value._id}>{value.country}</option>
                                    })
                                }
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <button type="submit" className="btn btn--prime mr-1">Save</button>
                            <Link to="/clients" className="btn btn--cancel ml-1">Cancel</Link>
                        </div>
                    </div>
                </form>
            </div></Fragment>);
}


export default AddClient