import React, { Component, Fragment, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import Select from 'react-select';

function AddIncome() {
    let errors = [];
    const [errorList, setErrorList] = useState(errors);
    const data = {
        date: new Date(),
        client_id: '',
        amount: '',
        medium: '',
        tags: [],
        notes: ''
    };

    const [mediums, setMediums] = useState([]);
    const [clients, setClients] = useState([]);
    const [tagOptions, setTagOptions] = useState([]);
    useEffect( () => {
        api.get('/get-income-mediums')
        .then((res) => {
            setMediums(res.data.medium);
        })
            .catch((res) => {
        })
        api.get('/getClients')
        .then((res) => {
            setClients(res.data.clients);
        })
            .catch((res) => {
        })
        api.get('/getTagList')
        .then((res) => {
            createTagOptions(res.data.tags);
        })
    }, [] );
    const [incomeData, setIncomeData] = useState([data]);

    const createTagOptions = data => {
        const options = data.map(value => {
            return {
                value:value,
                label:value
            }
        });
        setTagOptions(options);
    }

    const mediumList = mediums && mediums.map((medium, key) => {
        return <option value={medium._id} key={key}>{medium.medium}</option>
    })
    const clientList = clients && clients.map((client, key) => {
        return <option value={client._id} key={key}>{client.name}</option>
    })
    const handleInputChange = key => event => {
        const rows = [...incomeData];
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
        setIncomeData(rows)
    }

    const handleSelectChange = key => event => {
        const rows = [...incomeData];
        const tmp = event ? event.map(value => {
            return value['label'];
        }) : [];
        rows[key] = {
            ...rows[key],
            ['tags']: (event) ? event : [],
            ['tagsArray']: (event) ? tmp : []
        }
        setIncomeData(rows);
    }

    const addIncome = () => {
        setIncomeData([...incomeData, data]);
    }
    const removeIncome = (event) => {
        var array = [...incomeData];
        array.splice(event.target.value, 1);
        setIncomeData([...array]);
    }
    const saveIncomes = () => {
            api.post(`/incomes`, {data: incomeData})
            .then((res) => {
                setIncomeData([data]);
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
            <div className="bg-white p-3">
                <h2 className="heading mb-3">Add-Income</h2>
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
                    incomeData.map((incomeItem, key) =>
                        <div className="row mx-0 mb-2" key={key}>
                            <div className="col-md-3 form-group px-0 pr-md-3">
                                <DatePicker
                                    className="form-control"
                                    name="date"
                                    selected={incomeItem.date}
                                    onChange={handleInputChange(key)}
                                    dateFormat="dd-MM-yyyy"
                                />
                            </div>
                            <div className="col-md-3 form-group px-0 px-md-3">
                                <select name="client_id" className="form-control" onChange={handleInputChange(key)} value={incomeItem.client_id}>
                                    <option value="">Select Client</option>
                                    {
                                        clientList
                                    }
                                </select>
                            </div>
                            <div className="col-xl-2 col-md-3 form-group px-0 px-md-3">
                                <input type="text" name="amount" placeholder="Enter Amount" onChange={handleInputChange(key)} value={incomeItem.amount} className="form-control"/>
                            </div>
                            <div className="col-xl-2 col-md-3 form-group px-0 px-md-3">
                                <select name="medium" className="form-control" onChange={handleInputChange(key)} value={incomeItem.medium}>
                                    <option value="">Select Medium</option>
                                    {
                                        mediumList
                                    }
                                </select>
                            </div>
                            <div className="col-md-3 col-xl-2 form-group mb-md-0 px-0 px-md-2 px-lg-3">
                                <Select
                                    value={incomeData.tags}
                                    onChange={handleSelectChange(key)}
                                    isMulti
                                    options={tagOptions}
                                    placeholder='Select Tags'
                                />
                            </div>
                            <div className="col-xl-2 col-md-3 form-group px-0 px-md-3">
                                <textarea className="w-100 form-control" rows="1" placeholder="Enter Notes" name="notes" onChange={handleInputChange(key)} value={incomeItem.notes} />
                            </div>
                            {
                                (incomeData.length > 1 && key != 0) ?
                                    <div className="col-md-2 form-group">
                                        <button className="btn btn-danger" value={key} onClick={removeIncome}> Remove </button>
                                    </div>
                                : ''
                            }
                        </div>
                  )
                }
                <div className="row mx-0">
                    <div className="col-12 px-0">
                        <button className="btn btn-success mr-2" onClick={addIncome}> Add New</button>
                    </div>
                    <div className="col-12 px-0 mt-4">
                        <button className="btn btn--prime" onClick={saveIncomes}> Save </button>
                    </div>
                </div>

            </div>
        </Fragment>
    )
}

export default AddIncome;