import React, { Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../helpers/api";
import Select from "react-select";
import { ToastsStore } from "react-toasts";
import { formatDate, errorResponse } from "../../helpers";
const $ = require("jquery");

function AddExpense() {
    const [errors, setErrors] = useState([]);
    const data = {
        date: new Date(),
        item: "",
        amount: "",
        medium: "",
        tags: [],
        tagsArray: [],
        notes: ""
    };
    const [options, setOptions] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [disabled, setDisabled] = useState(false);

    useEffect(() => {
        api.get("/get-expense-mediums").then(res => {
            setMediums(res.data.medium);
        });

        api.get("/get-expense-tags").then(res => {
            createTagOptions(res.data.tags);
        });
    }, []);
    const createTagOptions = data => {
        const tagOption = data.map(value => {
            return {
                value: value._id,
                label: value.tag
            };
        });
        setOptions(tagOption);
    };
    const [expenseData, setExpenseData] = useState([data]);

    const mediumList =
        mediums &&
        mediums.map((medium, key) => {
            return (
                <option value={medium._id} key={key}>
                    {medium.medium}
                </option>
            );
        });
    const handleInputChange = key => event => {
        const rows = [...expenseData];
        if (event instanceof Date) {
            rows[key] = {
                ...rows[key],
                ["date"]: event
            };
        } else if (event.target.name == "file") {
            rows[key] = {
                ...rows[key],
                [event.target.name]: event.target.files[0]
            };
        } else {
            const { name, value } = event.target;
            rows[key] = {
                ...rows[key],
                [name]: value
            };
        }
        setExpenseData(rows);
    };
    const handleSelectChange = key => event => {
        const rows = [...expenseData];
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
        setExpenseData(rows);
    };
    const addExpense = () => {
        setExpenseData([...expenseData, data]);
    };
    const removeExpense = event => {
        var array = [...expenseData];
        array.splice(event.target.value, 1);
        setExpenseData([...array]);
    };
    const saveExpenses = () => {
        setDisabled(true);
        var formData = new FormData();

        Object.keys(expenseData).map(key => {
            Object.keys(expenseData[key]).map(fieldName => {
                if (fieldName == "date") {
                    formData.append(
                        "data[" + key + "][" + fieldName + "]",
                        formatDate(expenseData[key][fieldName])
                    );
                } else {
                    if (fieldName == "tagsArray") {
                        expenseData[key][fieldName].map(value => {
                            formData.append(
                                "data[" + key + "][" + fieldName + "][]",
                                value
                            );
                        });
                    } else {
                        formData.append(
                            "data[" + key + "][" + fieldName + "]",
                            expenseData[key][fieldName]
                        );
                    }
                }
            });
        });
        api.post(`/expenses`, formData)
            .then(res => {
                setDisabled(false);
                setExpenseData([data]);
                setErrors([]);
                $("#file").val("");
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
                <div className="row mx-0">
                    <h2 className="heading mb-3">Add-Expenses</h2>
                </div>
                {errors.length > 0 && (
                    <div className="alert alert-danger pb-0">
                        {errors.map((value, key) => (
                            <p key={key}>{value}</p>
                        ))}
                    </div>
                )}
                {expenseData.map((expenseItem, key) => (
                    <div className="row mx-0" key={key}>
                        <div className="col-xl-6 custom__col col-md-10 border p-xl-4 p-3 mb-3">
                            <div className="row mx-0 mt-2 flex-column flex-md-row">
                                <div className="col form-group px-0 px-lg-3 px-md-2">
                                    <DatePicker
                                        className="form-control"
                                        name="date"
                                        selected={expenseItem.date}
                                        onChange={handleInputChange(key)}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2">
                                    <input
                                        type="text"
                                        name="item"
                                        placeholder="Enter Item"
                                        onChange={handleInputChange(key)}
                                        value={expenseItem.item}
                                        className="form-control"
                                    />
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2">
                                    <input
                                        type="number"
                                        name="amount"
                                        placeholder="Enter Amount"
                                        onChange={handleInputChange(key)}
                                        value={expenseItem.amount}
                                        className="form-control"
                                    />
                                </div>
                            </div>

                            <div className="row mx-0 flex-column flex-md-row">
                                <div className="col form-group px-0 px-lg-3 px-md-2 mb-md-0">
                                    <select
                                        name="medium"
                                        className="form-control"
                                        onChange={handleInputChange(key)}
                                        value={expenseItem.medium}
                                    >
                                        <option value="">Select Medium</option>
                                        {mediumList}
                                    </select>
                                </div>
                                <div className="form-group mb-md-0 col px-0 px-lg-3 px-md-2">
                                    <Select
                                        value={expenseItem.tags}
                                        onChange={handleSelectChange(key)}
                                        isMulti
                                        options={options}
                                        placeholder="Select Tags"
                                    />
                                </div>
                                <div className="col form-group px-0 px-lg-3 px-md-2 mb-0">
                                    <textarea
                                        className="w-100 form-control"
                                        placeholder="Enter Notes"
                                        name="notes"
                                        onChange={handleInputChange(key)}
                                        value={expenseItem.notes}
                                    />
                                </div>
                            </div>

                            <div className="col mt-3 mt-md-0 px-0 px-lg-3 px-md-2">
                                <input
                                    id="file"
                                    className="h-100"
                                    type="file"
                                    name="file"
                                    onChange={handleInputChange(key)}
                                />
                            </div>
                        </div>
                        {expenseData.length > 1 && key != 0 ? (
                            <div className="col row mx-0 px-0">
                                <div className="col-md-3 px-0 px-md-3 form-group mb-md-0">
                                    <button
                                        className="btn btn--cancel"
                                        value={key}
                                        onClick={removeExpense}
                                    >
                                        {" "}
                                        Remove{" "}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            ""
                        )}
                    </div>
                ))}
                <div className="row mx-0">
                    <div className="col-12 px-0 mt-2">
                        <button
                            className="btn btn-success mr-2"
                            onClick={addExpense}
                        >
                            Add New
                        </button>
                    </div>
                    <div className="col-12 px-0 mt-4">
                        <button
                            className="btn btn--prime"
                            onClick={saveExpenses}
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

export default AddExpense;
