import React, { useState, Fragment, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";
import { errorResponse } from "../../helpers";
import config from "../../helpers/config";

const AddClient = props => {
    const initialFormState = {
        name: "",
        email: "",
        company_name: "",
        hourly_rate: "",
        currency: "",
        invoice_item_title: "",
        country_id: "",
        payment_medium_id: "",
        company_logo: "",
        address: ""
    };

    const [client, setClient] = useState(initialFormState);
    const [countries, setCountries] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [logoUrl, setLogoUrl] = useState("");
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(false);

    const logoDiv = {
        width: "170px",
        background: "#e8e8e8",
        padding: "10px",
        borderRadius: "5px",
        margin: "5px 0px"
    };

    useEffect(() => {
        api.get("/get-income-mediums")
            .then(res => {
                setMediums(res.data.medium);
            })
            .catch(res => {});
        api.get("/countries").then(res => {
            setCountries(res.data.country);
        });
    }, []);

    const mediumList =
        mediums &&
        mediums.map((medium, key) => {
            return (
                <option value={medium._id} key={key}>
                    {medium.medium}
                </option>
            );
        });

    const handleInputChange = event => {
        const { name, value } = event.target;
        if (name == "company_logo") {
            let file = event.target.files[0];
            setLogoUrl((window.URL ? URL : webkitURL).createObjectURL(file));
            setClient({ ...client, [name]: file });
            return;
        }
        setClient({ ...client, [name]: value });
    };

    const addClient = event => {
        setDisabled(true);
        event.preventDefault();
        const data = new FormData();
        for (let [key, value] of Object.entries(client)) {
            data.append(key, value || "");
        }
        return api
            .post("/clients/add", data)
            .then(res => {
                setDisabled(false);
                props.history.push("/clients");
                ToastsStore.success(res.data.message);
            })
            .catch(res => {
                setDisabled(false);
                errorResponse(res, setErrors);
            });
    };

    return (
        <Fragment>
            <div className="bg-white p-3">
                <h2 className="heading mb-3">Add-Client</h2>
                {errors.length > 0 && (
                    <div className="alert alert-danger pb-0">
                        {errors.map((value, key) => (
                            <p key={key}>{value}</p>
                        ))}
                    </div>
                )}
                <form
                    onSubmit={addClient}
                    method="post"
                    className="form-horizontal col-lg-6 col-12 px-0"
                >
                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="name"
                        >
                            Name:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Name"
                                name="name"
                                value={client.name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="name"
                        >
                            Email:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <input
                                type="email"
                                className="form-control"
                                placeholder="Enter Email"
                                name="email"
                                value={client.email}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="company_name"
                        >
                            Company Name:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Company Name"
                                name="company_name"
                                value={client.company_name}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="hourly_rate"
                        >
                            Hourly Rate:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Hourly Rate"
                                name="hourly_rate"
                                value={client.hourly_rate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="country_id"
                        >
                            Currency:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <select
                                className="form-control"
                                name="currency"
                                value={client.currency}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Currency</option>
                                {config.currencies.map((value, key) => {
                                    return (
                                        <option
                                            value={value.code}
                                            key={key}
                                        >
                                            {value.code}
                                        </option>
                                    );
                                })}
                                
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="invoice_item_title"
                        >
                            Invoice Item Title:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter Invoice Item Title"
                                name="invoice_item_title"
                                value={client.invoice_item_title}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="country_id"
                        >
                            Country:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <select
                                className="form-control"
                                name="country_id"
                                value={client.country_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Country</option>
                                {countries.map(value => {
                                    return (
                                        <option
                                            value={value._id}
                                            key={value._id}
                                        >
                                            {value.name}
                                        </option>
                                    );
                                })}
                            </select>
                        </div>
                    </div>
                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="payment_medium"
                        >
                            Preferred Payment Medium:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <select
                                className="form-control"
                                name="payment_medium_id"
                                value={client.payment_medium_id}
                                onChange={handleInputChange}
                            >
                                <option value="">Select Medium</option>
                                {mediumList}
                            </select>
                        </div>
                    </div>

                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="company_logo"
                        >
                            Company Logo:
                        </label>
                        <div className="col-sm-10 pl-0">
                            {logoUrl && (
                                <div style={logoDiv}>
                                    <img
                                        className="company-logo-img"
                                        src={logoUrl}
                                        alt="logo"
                                    />
                                </div>
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                className="form-control"
                                name="company_logo"
                                onChange={handleInputChange}
                                style={{ paddingBottom: "35px" }}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <label
                            className="control-label col-auto px-0"
                            htmlFor="address"
                        >
                            Address:
                        </label>
                        <div className="col-sm-10 pl-0">
                            <textarea
                                className="form-control"
                                rows="6"
                                placeholder="Enter Address"
                                name="address"
                                onChange={handleInputChange}
                                value={client.address}
                            />
                        </div>
                    </div>
                    <div className="form-group">
                        <div>
                            <button
                                type="submit"
                                className="btn btn--prime mr-1"
                                disabled={disabled}
                            >
                                Save
                            </button>
                            <Link
                                to="/clients"
                                className="btn btn--cancel ml-1"
                            >
                                Cancel
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </Fragment>
    );
};

export default AddClient;
