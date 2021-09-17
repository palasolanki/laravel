import React, { Component, Fragment, useState, useEffect } from "react";
import DatePicker from "react-datepicker";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";

function AddHardware() {
    let errors = [];
    const [errorList, setErrorList] = useState(errors);

    const data = {
        date: new Date(),
        item: "",
        type: "",
        serial_number: "",
        status: "",
        notes: ""
    };

    const [types, setTypes] = useState([]);
    useEffect(() => {
        api.get("/getHardwareType").then(res => {
            setTypes(res.data.type);
        });
    }, []);

    const [hardwareData, setHardwareData] = useState([data]);

    const typeList =
        types &&
        Object.keys(types).map(key => {
            return (
                <option value={key} key={key}>
                    {types[key]}
                </option>
            );
        });
    const handleInputChange = key => event => {
        const rows = [...hardwareData];
        if (event instanceof Date) {
            rows[key] = {
                ...rows[key],
                ["date"]: event
            };
        } else {
            const { name, value } = event.target;
            rows[key] = {
                ...rows[key],
                [name]: value
            };
        }
        setHardwareData(rows);
    };
    const addHardware = () => {
        setHardwareData([...hardwareData, data]);
    };
    const removeHardware = event => {
        var array = [...hardwareData];
        array.splice(event.target.value, 1);
        setHardwareData([...array]);
    };
    const createdateString = selectedDate => {
        let day = selectedDate.getDate();
        let month = selectedDate.getMonth() + 1;
        let year = selectedDate.getFullYear();
        return day + "/" + month + "/" + year;
    };
    const changeDateFormat = () => {
        const newData = hardwareData.map((value, key) => {
            if (value["date"]) {
                let newDate = createdateString(value["date"]);
                return {
                    ...value,
                    date: newDate
                };
            }
            return value;
        });
        return newData;
    };
    const saveHardwares = () => {
        api.post(`/hardwares`, { data: changeDateFormat() })
            .then(res => {
                setHardwareData([data]);
                setErrorList([]);
                ToastsStore.success(res.data.message);
            })
            .catch(function(error) {
                const tmp = error.response.data.errors;
                for (const key in tmp) {
                    if (!errors.includes(tmp[key][0])) {
                        errors.push(tmp[key][0]);
                    }
                }
                setErrorList(errors);
                ToastsStore.error(error.response.data.message);
            });
    };
    return (
        <Fragment>
            <div className="bg-white p-3">
                <h2 className="heading mb-3">Add-Hardware</h2>
                {errorList.length > 0 ? (
                    <div className="alert alert-danger pb-0">
                        {errorList.map((value, key) => (
                            <p key={key}>{value}</p>
                        ))}
                    </div>
                ) : (
                    ""
                )}
                {hardwareData.map((hardwareItem, key) => (
                    <div className="" key={key}>
                        <div className="row mx-0">
                            <div className="col-xl-6 col-md-8 border p-xl-4 p-3 mb-3">
                                <div className="row mx-0 mt-2 flex-column flex-md-row">
                                    <div className="col form-group px-0 px-lg-3 px-md-2">
                                        <DatePicker
                                            placeholder="Enter Purchase date"
                                            className="form-control"
                                            name="date"
                                            dateFormat="dd/MM/yyyy"
                                            selected={hardwareItem.date}
                                            onChange={handleInputChange(key)}
                                        />
                                    </div>
                                    <div className="col form-group px-0 px-lg-3 px-md-2">
                                        <input
                                            type="text"
                                            name="item"
                                            placeholder="Enter Item"
                                            onChange={handleInputChange(key)}
                                            value={hardwareItem.item}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="col form-group px-0 px-lg-3 px-md-2">
                                        <select
                                            name="type"
                                            className="form-control"
                                            onChange={handleInputChange(key)}
                                            value={hardwareItem.type}
                                        >
                                            <option value="">
                                                Select Type
                                            </option>
                                            {typeList}
                                        </select>
                                    </div>
                                </div>
                                <div className="row mx-0 align-items-center flex-column flex-md-row">
                                    <div className="col form-group px-0 px-lg-3 px-md-2 mb-md-0">
                                        <input
                                            type="text"
                                            name="serial_number"
                                            placeholder="Enter Serial Number"
                                            onChange={handleInputChange(key)}
                                            value={hardwareItem.serial_number}
                                            className="form-control"
                                        />
                                    </div>
                                    <div className="form-group mb-md-0 col px-0 px-lg-3 px-md-2">
                                        <select
                                            className="form-control"
                                            name="status"
                                            onChange={handleInputChange(key)}
                                            value={hardwareItem.status}
                                        >
                                            <option value="">
                                                Select Status
                                            </option>
                                            <option value="in_use">
                                                In-use
                                            </option>
                                            <option value="spare">Spare</option>
                                            <option value="needs_repair">
                                                Needs-Repair
                                            </option>
                                        </select>
                                    </div>
                                    <div className="col form-group px-0 px-lg-3 px-md-2 mb-0">
                                        <textarea
                                            className="w-100 form-control"
                                            placeholder="Enter Notes"
                                            name="notes"
                                            onChange={handleInputChange(key)}
                                            value={hardwareItem.notes}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="col row mx-0 px-0">
                                {hardwareData.length > 1 && key != 0 ? (
                                    <div className="col-md-3 px-0 px-md-3 form-group mb-md-0">
                                        <button
                                            className="btn btn--cancel"
                                            value={key}
                                            onClick={removeHardware}
                                        >
                                            Remove
                                        </button>
                                    </div>
                                ) : (
                                    ""
                                )}
                            </div>
                        </div>
                        {/* <div className="row mx-0 col-6 px-0">

                            </div> */}
                    </div>
                ))}
                <div className="row mx-0">
                    <div className="col-12 px-0 mt-2">
                        <button
                            className="btn btn-success mr-2"
                            onClick={addHardware}
                        >
                            Add New
                        </button>
                    </div>
                    <div className="col-12 px-0 mt-4">
                        <button
                            className="btn btn--prime"
                            onClick={saveHardwares}
                        >
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default AddHardware;
