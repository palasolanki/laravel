import React, { Component, Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";
import Select from "react-select";
import { formatDate, errorResponse } from "../../helpers";

function AddIncome() {
    const [errors, setErrors] = useState([]);
    const data = {
        date: new Date(),
        client_id: "",
        amount: "",
        medium: "",
        tags: [],
        notes: ""
    };

    const [mediums, setMediums] = useState([]);
    const [clients, setClients] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        api.get("/get-income-mediums")
            .then(res => {
                setMediums(res.data.medium);
            })
            .catch(res => {});
        api.get("/getClients")
            .then(res => {
                setClients(res.data.clients);
            })
            .catch(res => {});
        api.get("/get-income-tags").then(res => {
            createTagOptions(res.data.tags);
        });
    }, []);
    const [incomeData, setIncomeData] = useState([data]);

    const createTagOptions = data => {
        const options = data.map(value => {
            return {
                value: value._id,
                label: value.tag
            };
        });
        setTagOptions(options);
    };

    const mediumList =
        mediums &&
        mediums.map((medium, key) => {
            return (
                <option value={medium._id} key={key}>
                    {medium.medium}
                </option>
            );
        });
    const clientList =
        clients &&
        clients.map((client, key) => {
            return (
                <option value={client._id} key={key}>
                    {client.name + ` (` + client.company_name + `)`}
                </option>
            );
        });

    const handleInputChange = key => event => {
        const rows = [...incomeData];
        if (event instanceof Date) {
            rows[key] = {
                ...rows[key],
                ["date"]: event
            };
        } else if (event.target.name === "client_id") {
            if (event.target.value != "") {
                rows[key].medium = clients.find(
                    client => client._id === event.target.value
                ).payment_medium_id
                    ? clients.find(client => client._id === event.target.value)
                          .payment_medium_id
                    : "";
            }
            rows[key] = {
                ...rows[key],
                [event.target.name]: event.target.value
            };
        } else {
            rows[key] = {
                ...rows[key],
                [event.target.name]: event.target.value
            };
        }
        setIncomeData(rows);
    };

    const handleSelectChange = key => event => {
        const rows = [...incomeData];
        const tmp = event
            ? event.map(value => {
                  return value["value"];
              })
            : [];
        rows[key] = {
            ...rows[key],
            ["tags"]: event ? event : [],
            ["tagsArray"]: event ? tmp : []
        };
        setIncomeData(rows);
    };

    const addIncome = () => {
        setIncomeData([...incomeData, data]);
    };
    const removeIncome = event => {
        var array = [...incomeData];
        array.splice(event.target.value, 1);
        setIncomeData([...array]);
    };
    const saveIncomes = () => {
        setDisabled(true);
        const tempIncomeData = incomeData.map((incomeItem, key) => {
            return { ...incomeItem, date: formatDate(incomeItem.date) };
        });
        api.post(`/incomes`, { data: tempIncomeData })
            .then(res => {
                setDisabled(false);
                setIncomeData([data]);
                setErrors([]);
                ToastsStore.success(res.data.message);
            })
            .catch(function(res) {
                setDisabled(false);
                errorResponse(res, setErrors);
            });
    };
    return (
        <Fragment>
            <div className="bg-white p-3">
                <h2 className="heading mb-3">Add-Income</h2>
                {errors.length > 0 && (
                    <div className="alert alert-danger pb-0">
                        {errors.map((value, key) => (
                            <p key={key}>{value}</p>
                        ))}
                    </div>
                )}
                {incomeData.map((incomeItem, key) => (
                    <div className="row mx-0 mb-2" key={key}>
                        <div className="col-xl-6 custom__col col-md-10 border p-xl-4 p-3 mb-3">
                            <div className="row mx-0 mt-2 flex-column flex-md-row">
                                <div className="col form-group px-0 px-lg-3 px-md-2">
                                    <DatePicker
                                        className="form-control"
                                        name="date"
                                        selected={incomeItem.date}
                                        onChange={handleInputChange(key)}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2">
                                    <select
                                        name="client_id"
                                        className="form-control"
                                        onChange={handleInputChange(key)}
                                        value={incomeItem.client_id}
                                    >
                                        <option value="">Select Client</option>
                                        {clientList}
                                    </select>
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2">
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Enter Amount"
                                        onChange={handleInputChange(key)}
                                        value={incomeItem.amount}
                                        className="form-control"
                                    />
                                </div>
                            </div>
                            <div className="row mx-0 align-items-center flex-column flex-md-row">
                                <div className="col form-group px-0 px-lg-3 px-md-2 mb-md-0">
                                    <select
                                        name="medium"
                                        className="form-control"
                                        onChange={handleInputChange(key)}
                                        value={incomeItem.medium}
                                    >
                                        <option value="">Select Medium</option>
                                        {mediumList}
                                    </select>
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2 mb-md-0">
                                    <Select
                                        value={incomeItem.tags}
                                        onChange={handleSelectChange(key)}
                                        isMulti
                                        options={tagOptions}
                                        placeholder="Select Tags"
                                    />
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2 mb-md-0">
                                    <textarea
                                        className="w-100 form-control"
                                        rows="2"
                                        placeholder="Enter Notes"
                                        name="notes"
                                        onChange={handleInputChange(key)}
                                        value={incomeItem.notes}
                                    />
                                </div>
                            </div>
                        </div>
                        {incomeData.length > 1 && key != 0 ? (
                            <div className="col row mx-0 px-0">
                                <div className="col-md-3 px-0 px-md-3 form-group mb-md-0">
                                    <button
                                        className="btn btn--cancel"
                                        value={key}
                                        onClick={removeIncome}
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                ))}
                <div className="row mx-0">
                    <div className="col-12 px-0">
                        <button
                            className="btn btn-success mr-2"
                            onClick={addIncome}
                        >
                            Add New
                        </button>
                    </div>
                    <div className="col-12 px-0 mt-4">
                        <button
                            className="btn btn--prime"
                            onClick={saveIncomes}
                            disabled={disabled}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AddIncome;
