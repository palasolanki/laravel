import React, { Component, Fragment, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import api from '../../helpers/api';
import {ToastsContainer, ToastsStore, ToastsContainerPosition} from 'react-toasts';

function AddIncome() {
    let errors = [];
    const [errorList, setErrorList] = useState(errors);
    const data = {
        date: new Date(),
        client: '',
        amount: '',
        medium: ''
    };

    const [mediums, setMediums] = useState([]);
    const [clients, setClients] = useState([]);
    useEffect( () => {
        api.get('/getIncomeMediumList')
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
    }, [] );
    const [incomeData, setIncomeData] = useState([data]);

    const mediumList = Object.keys(mediums).map((key) => {
        return <option value={key} key={key}>{mediums[key]}</option>
    })
    const clientList = clients.map((client, key) => {
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
            <div className="bg-white">
                <h2>Add-Income</h2>
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
                    incomeData.map((incomeItem, key) =>
                        <div className="row ml-2" key={key}>
                            <div className="col-md-3 form-group">
                                <DatePicker
                                    className="form-control"
                                    name="date"
                                    selected={incomeItem.date}
                                    onChange={handleInputChange(key)}
                                />
                            </div>
                            <div className="col-md-3 form-group">
                                <select name="client" className="form-control" onChange={handleInputChange(key)} value={incomeItem.client}>
                                    <option value="">SELECT</option>
                                    {
                                        clientList
                                    }
                                </select>
                            </div>
                            <div className="col-md-2 form-group">
                                <input type="text" name="amount" placeholder="Enter Amount" onChange={handleInputChange(key)} value={incomeItem.amount} className="form-control"/>
                            </div>
                            <div className="col-md-2 form-group">
                                <select name="medium" className="form-control" onChange={handleInputChange(key)} value={incomeItem.medium}>
                                    <option value="">SELECT</option>
                                    {
                                        mediumList
                                    }
                                </select>
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
                <div className="row ml-4">
                    <button className="col-md-1 btn btn-success" onClick={addIncome}><i aria-hidden="true" className="fa fa-plus-circle"></i> Add New</button>
                    <button className="col-md-1 btn btn-primary" onClick={saveIncomes}> Save </button>
                </div>

            </div>
        </Fragment>
    )
}

export default AddIncome;