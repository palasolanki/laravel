import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import EditExpenses from "./Edit-Expense";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';

function Expense() {
    const [showEditModal, setEditShow] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const [showDeleteModal, setDeleteShow] = useState(false);
    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    const expenseData = [];
    const [mediums, setMediums] = useState([]);
    const [expenses, setExpenses] = useState(expenseData);
    useEffect( () => {
      api.get('/expenses')
          .then((res) => {
            setExpenses(res.data);
          })
          .catch((res) => {
        }),
        api.get('/getExpenseMediumList')
        .then((res) => {
            setMediums(res.data.medium);
        })

        api.get('/getTagList')
        .then((res) => {
            createTagOptions(res.data.tags);
        })
    }, [] );

    const [options, setOptions] = useState([]);
    const createTagOptions = data => {
        const tagOptions = data.map(value => {
            return {
                value: value,
                label: value
            }
        });
        setOptions(tagOptions);
    }
    const [currentExpense, setCurrentExpense] = useState()
    const editRow = expense => {
        setCurrentExpense(expense)
        openShowEdit();
    }

    const updateExpense = (expenseId, updatedExpense) => {
        api.patch(`/expenses/${expenseId}`, {data:updatedExpense})
        .then((res) => {
            setExpenses(expenses.map(expense => (expense._id === expenseId ? res.data.updateExpense : expense)))
            handleCloseEdit();
            ToastsStore.success(res.data.message);
        })
    }

    const [deleteExpenseId, setDeleteExpenseId] = useState();
    const setDeleteExpenseIdFunction = currentDeleteExpenseId =>{
        setDeleteExpenseId(currentDeleteExpenseId);
        openShowDelete();
    }

    const deleteExpense = expenseId => {
        api.delete(`/expenses/${expenseId}`)
        .then((res) => {
            setExpenses(expenses.filter(expense => expense._id !== expenseId))
            handleCloseDelete();
            ToastsStore.error(res.data.message);
        })
    }

    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Expenses</h2>
                        <Link to="expenses/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Expense</Link>
                    </div>
                    {/* <h2>Expenses</h2>
                    <Link
                        style= {{ margin: '10px 10px' }}
                        to="expenses/add"
                        className="btn btn-info btn-lg">
                        Add Expense
                    </Link> */}
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Amount</th>
                                <th>Medium</th>
                                <th>Tags</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {expenses.length > 0 ? (
                          expenses.map(expense => (
                                <tr key={expense._id}>
                                    <td>{expense.date}</td>
                                    <td>{expense.item}</td>
                                    <td>{expense.amount}</td>
                                    <td>{mediums[expense.medium]}</td>
                                    <td>
                                        { (expense.tags.length > 0) ? expense.tags.toString() : '-' }
                                    </td>
                                    <td>
                                        <button className="btn btn-sm btn--prime" onClick={() => editRow(expense)}>Edit</button>&nbsp;
                                        <button className="btn btn-sm btn--cancel" onClick={() => setDeleteExpenseIdFunction(expense._id)}>Delete</button>
                                    </td>
                                </tr>
                          ))
                        ) : (
                                <tr>
                                  <td colSpan={3}>No Expenses</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                     {showEditModal && <EditExpenses handleCloseEdit={handleCloseEdit} currentExpense={currentExpense} mediums={mediums} options={options} updateExpense={updateExpense} />}
                     {showDeleteModal &&
                         <div>
                           <div style={{ display: 'block' }} className="modal">
                             <div className="modal-dialog register-modal-dialog">
                               <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                                   <div style={{textAlign: 'center',}}>
                                       <h3>Are you sure to delete this expense?</h3>
                                   </div>
                                   <div style={{textAlign: 'center',}} className="modal-body">
                                         <button style={{color: '#fff',}} className="btn btn-info" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                                         <button className="btn btn-danger" onClick={() => deleteExpense(deleteExpenseId)}>Delete</button>
                                   </div>
                               </div>
                             </div>
                           </div>
                           <div className="modal-backdrop show" />
                         </div>
                     }

                </div>
            )
}

export default Expense;
