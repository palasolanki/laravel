import React, { Component, Fragment, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import api from '../../helpers/api';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

function AddHardware() {
    let errors = [];
    const [errorList, setErrorList] = useState(errors);

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
        setHardwareData(rows);
    }
    const addHardware = () => {
        setHardwareData([...hardwareData, data]);
    }
    const removeHardware = (event) => {
        var array = [...hardwareData];
        array.splice(event.target.value, 1);
        setHardwareData([...array]);
    }
    const createdateString = (selectedDate) => {
        let day = selectedDate.getDate();
        let month = selectedDate.getMonth() + 1;
        let year = selectedDate.getFullYear();
        return day+"/"+month+"/"+year;
    }
    const changeDateFormat = () => {
        const newData = hardwareData.map((value, key) => {
            if(value['date']) {
                let newDate = createdateString(value['date']);
                return {
                    ...value,
                    date: newDate
                }
            }
            return value;
        });
        return newData;
    }
    const saveHardwares = () => {
            api.post(`/hardwares`, {data: changeDateFormat()})
            .then((res) => {
                setHardwareData([data]);
                setErrorList([]);
                ToastsStore.success(res.data.message);
            })
            .catch(function (error) {
                const tmp = error.response.data.errors;
                for (const key in tmp) {
                    if (!errors.includes(tmp[key][0])) {
                        errors.push(tmp[key][0]);
                    }
                }
                setErrorList(errors);
            });
    }
    return  (
        <Fragment>
            <div className="bg-white">
                <h2>Add-Hardware</h2>
                <ToastsContainer position={ToastsContainerPosition.TOP_RIGHT} store={ToastsStore}/>
                {
                    (errorList.length > 0) ?
                        <div className="alert alert-danger">
                            {errorList.map((value, key) =>
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
                                    dateFormat="dd/MM/yyyy"
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