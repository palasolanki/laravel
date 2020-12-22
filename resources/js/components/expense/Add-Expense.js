import React, { Fragment, useState, useEffect } from 'react'
import DatePicker from "react-datepicker";
import api from '../../helpers/api';
import Select from 'react-select';
import {ToastsStore} from 'react-toasts';

function AddExpense() {
    let errors = [];
    const [errorList, setErrorList] = useState(errors);
    const data = {
        date: new Date(),
        item: '',
        amount: '',
        medium: '',
        tags: [],
        tagsArray: [],
        notes: ''
    };
    const [options, setOptions] = useState([]);

    const [mediums, setMediums] = useState([]);
    useEffect( () => {
        api.get('/getExpenseMediumList')
        .then((res) => {
            setMediums(res.data.medium);
        })

        api.get('/getTagList')
        .then((res) => {
            createTagOptions(res.data.tags);
        })
    }, [] );
    const createTagOptions = data => {
        const tagOption = data.map(value => {
            return {
                value:value,
                label:value
            }
        });
        setOptions(tagOption);
    }
    const [expenseData, setExpenseData] = useState([data]);

    const mediumList = mediums && Object.keys(mediums).map((key) => {
        return <option value={key} key={key}>{mediums[key]}</option>
    })
    const handleInputChange = key => event => {
        const rows = [...expenseData];
        if (event instanceof Date) {
            rows[key] = {
                ...rows[key],
                ['date']:event
            }
        } else if(event.target.name == "file") {
            rows[key] = {
                ...rows[key],
                [event.target.name]:event.target.files[0]
            }
        } else {
            const { name, value } = event.target;
            rows[key] = {
                ...rows[key],
                [name]:value
            }
        }
        setExpenseData(rows)
    }
    const handleSelectChange = key => event => {
        const rows = [...expenseData];
        const tmp = event.map(value => {
            return value['label'];
        })
        rows[key] = {
            ...rows[key],
            ['tags']: (event) ? event : [],
            ['tagsArray']: (event) ? tmp : []
        }
        setExpenseData(rows)
    }
    const addExpense = () => {
        setExpenseData([...expenseData, data]);
    }
    const removeExpense = (event) => {
        var array = [...expenseData];
        array.splice(event.target.value, 1);
        setExpenseData([...array]);
    }
    const saveExpenses = () => {
        var formData = new FormData();

        Object.keys(expenseData).map((key) => {
            Object.keys(expenseData[key]).map((fieldName) => {
                if(fieldName == 'date') {
                    const isoDate = new Date(expenseData[key][fieldName]).toISOString();
                    formData.append("data["+key+"]["+fieldName+"]", isoDate)
                } else {
                    formData.append("data["+key+"]["+fieldName+"]", expenseData[key][fieldName])
                }
            })
        })
        api.post(`/expenses`, formData)
            .then((res) => {
                setExpenseData([data]);
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
                <div className="row mx-0">
                    <h2 className="heading mb-3">Add-Expenses</h2>
                </div>
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
                    expenseData.map((expenseItem, key) =>
                        <div className="row mx-0 align-items-center mb-md-3" key={key}>
                            <div className="row w-100 flex-nowrap mx-0 align-items-center">
                                <div className="col-md-2 form-group mb-md-0 px-0 pl-md-0">
                                    <DatePicker
                                        className="form-control"
                                        name="date"
                                        selected={expenseItem.date}
                                        onChange={handleInputChange(key)}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                                <div className="col-md-2 form-group mb-md-0 px-0 px-md-2 px-lg-3">
                                    <input type="text" name="item" placeholder="Enter Item" onChange={handleInputChange(key)} value={expenseItem.item} className="form-control"/>
                                </div>
                                <div className="col-md-2 form-group mb-md-0 px-0 px-md-2 px-lg-3">
                                    <input type="text" name="amount" placeholder="Enter Amount" onChange={handleInputChange(key)} value={expenseItem.amount} className="form-control"/>
                                </div>
                                <div className="col-md-3 col-xl-2 form-group mb-md-0 px-0 px-md-2 px-lg-3">
                                    <select name="medium" className="form-control" onChange={handleInputChange(key)} value={expenseItem.medium}>
                                        <option value="">Select Medium</option>
                                    {
                                        mediumList
                                    }
                                    </select>
                                </div>
                                <div className="col-md-3 col-xl-2 form-group mb-md-0 px-0 px-md-2 px-lg-3">
                                    <Select
                                        value={expenseItem.tags}
                                        onChange={handleSelectChange(key)}
                                        isMulti
                                        options={options}
                                        placeholder='Select Tags'
                                    />
                                </div>
                                <div className="col-md-3 col-xl-2 form-group mb-md-0 px-0 px-md-2 px-lg-3">
                                    <textarea className="w-100 form-control" placeholder="Enter Notes" name="notes" onChange={handleInputChange(key)} value={expenseItem.notes} />
                                </div>
                                <input className="h-100" type="file" name="file" onChange={handleInputChange(key)}/>
                            </div>
                            {
                                (expenseData.length > 1 && key != 0) ?
                                    <div className="col-12 px-0">
                                        <div className="form-group mb-md-0 mt-3">
                                            <button className="btn btn-danger" value={key} onClick={removeExpense}> Remove </button>
                                        </div>
                                    </div>
                                : ''
                            }
                        </div>
                  )
                }
                <div className="row mx-0">
                    <div className="col-12 px-0">
                        <button className="btn btn-success mr-2" onClick={addExpense}> Add New</button>
                    </div>
                    <div className="col-12 px-0 mt-4">
                        <button className="btn btn--prime" onClick={saveExpenses}> Save </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

export default AddExpense;