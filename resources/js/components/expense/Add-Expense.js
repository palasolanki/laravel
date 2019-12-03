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
        tagsArray: []
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

    const mediumList = Object.keys(mediums).map((key) => {
        return <option value={key} key={key}>{mediums[key]}</option>
    })
    const handleInputChange = key => event => {
        const rows = [...expenseData];
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
            api.post(`/expenses`, {data: expenseData})
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
            <div className="bg-white">
                <h2>Add-Expenses</h2>
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
                        <div className="row ml-2" key={key}>
                            <div className="col-md-2 form-group">
                                <DatePicker
                                    className="form-control"
                                    name="date"
                                    selected={expenseItem.date}
                                    onChange={handleInputChange(key)}
                                />
                            </div>
                            <div className="col-md-2 form-group">
                                <input type="text" name="item" placeholder="Enter Item" onChange={handleInputChange(key)} value={expenseItem.item} className="form-control"/>
                            </div>
                            <div className="col-md-2 form-group">
                                <input type="text" name="amount" placeholder="Enter Amount" onChange={handleInputChange(key)} value={expenseItem.amount} className="form-control"/>
                            </div>
                            <div className="col-md-2 form-group">
                                <select name="medium" className="form-control" onChange={handleInputChange(key)} value={expenseItem.medium}>
                                    <option value="">SELECT</option>
                                    {
                                        mediumList
                                    }
                                </select>
                            </div>
                            <div className="col-md-2 form-group">
                                <Select
                                    value={expenseItem.tags}
                                    onChange={handleSelectChange(key)}
                                    isMulti
                                    options={options}
                                />
                            </div>
                            {
                                (expenseData.length > 1 && key != 0) ?
                                    <div className="col-md-2 form-group">
                                        <button className="btn btn-danger" value={key} onClick={removeExpense}> Remove </button>
                                    </div>
                                : ''
                            }
                        </div>
                  )
                }
                <div className="row ml-4">
                    <button className="col-md-1 btn btn-success" onClick={addExpense}><i aria-hidden="true" className="fa fa-plus-circle"></i> Add New</button>
                    <button className="col-md-1 btn btn-primary" onClick={saveExpenses}> Save </button>
                </div>

            </div>
        </Fragment>
    )
}

export default AddExpense;