import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import EditIncomes from "./Edit-Income";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';

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
        api.get('/getIncomeMediumList')
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
            ToastsStore.success(res.data.message);
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
            ToastsStore.error(res.data.message);
        })
    }

    const getClientName = (clientId) => {
        return clients.map(client => {
            return (client._id == clientId) ? client.name : ''
        })
    }
    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Income</h2>
                        <Link to="incomes/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Income</Link>
                    </div>
                    <div className="table-responsive">
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
                                        <td>{getClientName(income.client)}</td>
                                        <td>{income.amount}</td>
                                        <td>{mediums[income.medium]}</td>
                                        <td>
                                            <button className="btn btn-sm btn--prime" onClick={() => editRow(income)}>Edit</button>&nbsp;
                                            <button className="btn btn-sm btn--cancel ml-1" onClick={() => setDeleteIncomeIdFunction(income._id)}>Delete</button>
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
                    </div>

                     {showEditModal && <EditIncomes handleCloseEdit={handleCloseEdit} currentIncome={currentIncome} mediums={mediums} clients={clients} updateIncome={updateIncome} />}
                     {showDeleteModal &&
                         <div>
                           <div style={{ display: 'block' }} className="modal">
                             <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                               <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                                   <div style={{textAlign: 'center',}}>
                                       <h3 className="heading">Are you sure to delete this Income?</h3>
                                   </div>
                                   <div style={{textAlign: 'center',}} className="modal-body">
                                        <button style={{color: '#fff',}} className="btn btn--prime mr-1" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                                        <button className="btn btn--cancel ml-1" onClick={() => deleteIncome(deleteIncomeId)}>Delete</button>
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
