import React, { Component, Fragment, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import api from '../../helpers/api';

function AddHardware() {
    let errorArray = [];
    const [isErrorArray, setErrorArray] = useState(errorArray);

    const data = {
        date: '',
        item: '',
        type: '',
        serial_number: '',
        status: '',
        notes: ''
    };

    const [types, setTypes] = useState([]);
    useEffect( () => {
        api.get('/getHardwareType')
        .then((res) => {
            setTypes(res.data.type);
        })
    }, [] );

    const [hardwareData, setHardwareData] = useState([data]);

    const typeList = Object.keys(types).map((key) => {
        return <option value={key} key={key}>{types[key]}</option>
    })
    const handleInputChange = key => event => {
        const rows = [...hardwareData];
        if (event instanceof Date) {
            rows[key] = {
                ...rows[key],
                ['date']:event
            }
        } else {
            const { name, value } = event.target;
            rows[key] = {
                ...rows[key],
                [name]:value
            }
        }
        setHardwareData(rows)
    }
    const addHardware = () => {
        setHardwareData([...hardwareData, data]);
    }
    const removeHardware = (event) => {
        var array = [...hardwareData];
        array.splice(event.target.value, 1);
        setHardwareData([...array]);
    }
    const saveHardwares = () => {
            api.post(`/hardwares`, {data: hardwareData})
            .then((res) => {
                setHardwareData([data]);
            })
            .catch(function (error) {
                const errors = error.response.data.errors;
                for (const key in errors) {
                    if (!errorArray.includes(errors[key][0])) {
                        errorArray.push(errors[key][0]);
                    }
                }
                setErrorArray(errorArray);
            });
    }
    return  (
        <Fragment>
            <div className="bg-white">
                <h2>Add-Hardware</h2>
                {
                    (isErrorArray.length > 0) ?
                        <div className="alert alert-danger">
                            {isErrorArray.map((value, key) =>
                                <p key={key}>{value}</p>
                            )}
                        </div>
                    : ''
                }
                {
                    hardwareData.map((hardwareItem, key) =>
                        <div className="row ml-2" key={key}>
                            <div className="col-md-2 form-group">
                                <DatePicker
                                    placeholder="Enter Purchase date"
                                    className="form-control"
                                    name="date"
                                    selected={hardwareItem.date}
                                    onChange={handleInputChange(key)}
                                />
                            </div>
                            <div className="col-md-2 form-group">
                                <input type="text" name="item" placeholder="Enter Item" onChange={handleInputChange(key)} value={hardwareItem.item} className="form-control"/>
                            </div>
                            <div className="col-md-1 form-group">
                                <select name="type" className="form-control" onChange={handleInputChange(key)} value={hardwareItem.type}>
                                    <option value="">SELECT</option>
                                    {
                                        typeList
                                    }
                                </select>
                            </div>
                            <div className="col-md-2 form-group">
                                <input type="text" name="serial_number" placeholder="Enter Serial Number" onChange={handleInputChange(key)} value={hardwareItem.serial_number} className="form-control"/>
                            </div>
                            <div className="form-group">
                                <select className="form-control" name="status" onChange={handleInputChange(key)} value={hardwareItem.status}>
                                    <option value="">Select Type</option>
                                    <option value="in_use">In-use</option>
                                    <option value="spare">Spare</option>
                                    <option value="needs_repair">Needs-Repair</option>
                                </select>
                            </div>
                            <div className="col-md-2 form-group">
                                <textarea placeholder="Enter Notes" name="notes" onChange={handleInputChange(key)}  value={hardwareItem.notes} />
                            </div>
                            {
                                (hardwareData.length > 1 && key != 0) ?
                                    <div className="col-md-1 form-group">
                                        <button className="btn btn-danger" value={key} onClick={removeHardware}> Remove </button>
                                    </div>
                                : ''
                            }
                        </div>
                  )
                }
                <div className="row ml-4">
                    <button className="col-md-1 btn btn-success" onClick={addHardware}><i aria-hidden="true" className="fa fa-plus-circle"></i> Add New</button>
                    <button className="col-md-1 btn btn-primary" onClick={saveHardwares}> Save </button>
                </div>

            </div>
        </Fragment>
    )
}

export default AddHardware;