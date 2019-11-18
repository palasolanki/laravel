import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';

import EditIncomes from "./Edit-Income";

function Income() {
    const incomesData = [];
    const [incomes, setIncomes] = useState(incomesData);
    const [mediums, setMediums] = useState([]);
    const [clients, setClients] = useState([]);

    const [showEditModal, setEditShow] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const [showDeleteModal, setDeleteShow] = useState(false);
    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    useEffect( () => {
      api.get('/incomes')
          .then((res) => {
            setIncomes(res.data);
          })
          .catch((res) => {
        }),
        api.get('/getMedium')
        .then((res) => {
            setMediums(res.data.medium);
        }),
        api.get('/getClients')
        .then((res) => {
            setClients(res.data.clients);
        })
    }, [] );
    const [currentIncome, setCurrentIncome] = useState()
    const editRow = income => {
        setCurrentIncome(income)
        openShowEdit();
    }

    const updateIncome = (incomeId, updatedIncome) => {
        api.patch(`/incomes/${incomeId}`, {data:updatedIncome})
        .then((res) => {
            setIncomes(incomes.map(income => (income._id === incomeId ? res.data.updateIncome : income)))
            handleCloseEdit();
        })
    }

    const [deleteIncomeId, setDeleteIncomeId] = useState();
    const setDeleteIncomeIdFunction = currentDeleteIncomeId =>{
        setDeleteIncomeId(currentDeleteIncomeId);
        openShowDelete();
    }

    const deleteIncome = incomeId => {
        api.delete(`/incomes/${incomeId}`)
        .then((res) => {
            setIncomes(incomes.filter(income => income._id !== incomeId))
            handleCloseDelete();
        })
    }

    return  (
                <div className="bg-white">
                    <h2>Income</h2>

                    <Link
                        style= {{ margin: '10px 10px' }}
                        to="incomes/add"
                        className="btn btn-info btn-lg">
                        Add Income
                    </Link>
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Date</th>
                                <th>Client</th>
                                <th>Amount</th>
                                <th>Medium</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {incomes.length > 0 ? (
                          incomes.map(income => (
                                <tr key={income._id}>
                                    <td>{income.date}</td>
                                    <td>{income.client}</td>
                                    <td>{income.amount}</td>
                                    <td>{mediums[income.medium]}</td>
                                    <td>
                                        <button className="btn btn-sm btn--prime" onClick={() => editRow(income)}>Edit</button>&nbsp;
                                        <button className="btn btn-sm btn--cancel" onClick={() => setDeleteIncomeIdFunction(income._id)}>Delete</button>
                                    </td>
                                </tr>
                          ))
                        ) : (
                                <tr>
                                  <td colSpan={3}>No Incomes</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                     {showEditModal && <EditIncomes handleCloseEdit={handleCloseEdit} currentIncome={currentIncome} mediums={mediums} clients={clients} updateIncome={updateIncome} />}
                     {showDeleteModal &&
                         <div>
                           <div style={{ display: 'block' }} className="modal">
                             <div className="modal-dialog register-modal-dialog">
                               <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                                   <div style={{textAlign: 'center',}}>
                                       <h3>Are you sure to delete this Income?</h3>
                                   </div>
                                   <div style={{textAlign: 'center',}} className="modal-body">
                                         <button style={{color: '#fff',}} className="btn btn-info" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                                         <button className="btn btn-danger" onClick={() => deleteIncome(deleteIncomeId)}>Delete</button>
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

export default Income;
