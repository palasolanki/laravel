import React, { Component, Fragment, useState, useEffect } from 'react'
import api from '../../helpers/api';

// import AddTags from "./Add-Tags";
import EditExpenses from "./Edit-Expense";

function newPath(path) {
    console.log(path);
}
function Expense() {
    const [showEditModal, setEditShow] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const [showDeleteModal, setDeleteShow] = useState(false);
    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    const expenseData = [];
    const [expenses, setExpenses] = useState(expenseData);
    useEffect( () => {
      api.get('/expenses')
          .then((res) => {
            setExpenses(res.data);
          })
          .catch((res) => {
        })
    }, [] );

    const [currentExpense, setCurrentExpense] = useState()
    const editRow = expense => {
        setCurrentExpense(expense)
        openShowEdit();
    }

    const updateExpense = (expenseId, updatedExpense) => {
        api.patch(`/expenses/${expenseId}`, updatedExpense)
        .then((res) => {
            setExpenses(expenses.map(expense => (expense._id === expenseId ? res.data.updateExpense : expense)))
            handleCloseEdit();
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
        })
    }

    return  (
                <div className="bg-white">
                    <h2>Expenses</h2>

                    <button style={{ margin: '10px 10px' }} type="button" className="btn btn-info btn-lg" onClick={ () => newPath('expenses/add')}>Add Expense</button>

                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Date</th>
                                <th>Item</th>
                                <th>Amount</th>
                                <th>Medium</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {expenses.length > 0 ? (
                          expenses.map(expense => (
                                <tr key={expense._id}>
                                    <td>{expense.date.date}</td>
                                    <td>{expense.item}</td>
                                    <td>{expense.amount}</td>
                                    <td>{expense.medium}</td>
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

                     {/* {showAddModal && <AddTags handleClose={handleClose} addTag={addTag}/>} */}
                     {showEditModal && <EditExpenses handleCloseEdit={handleCloseEdit} currentExpense={currentExpense} updateExpense={updateExpense} />}
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
