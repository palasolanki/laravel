import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import EditIncomes from "./Edit-Income";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';
const $ = require('jquery')
$.DataTable = require('datatables.net')

export default function Income() {
    const [dataTable, setDataTable] = useState(null);
    const [mediums, setMediums] = useState([]);
    const [clients, setClients] = useState([]);

    const [showEditModal, setEditShow] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const [showDeleteModal, setDeleteShow] = useState(false);
    const handleCloseDelete = () => setDeleteShow(false);

    useEffect( () => {
        api.get('/getIncomeMediumList')
        .then((res) => {
            setMediums(res.data.medium);
        }),
        api.get('/getClients')
        .then((res) => {
            setClients(res.data.clients);
        });
    }, [] );

    const [currentIncome, setCurrentIncome] = useState()
    const editRow = income => {
        setCurrentIncome(income)
        openShowEdit();
    }

    useEffect(() => {
        var table = $('#datatable').DataTable({
            ajax: {
                "url": '/api/incomes',
                "dataType": 'json',
                "type": 'get',
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader('Authorization',
                        "Bearer " + localStorage.getItem('token'));
                },
            },
            columns: [
                { title: "Date", data: 'date' },
                { title: "Client", data: 'client' },
                { title: "Amount", data: 'amount' },
                { title: "Medium", data: 'medium' },
                { title: "Action", data: 'null', defaultContent: 'N/A' }
            ],
            rowCallback: function( row, data, index ) {
                let action = '<button data-index="' + index + '" class="btn btn-sm btn--prime editData">Edit</button> <button id="' + data._id + '" class="btn btn-sm btn--cancel deletData" >Delete</button>'
                $('td:eq(4)', row).html( action );
            }
        });
        setDataTable(table);        
    }, []);

    useEffect(() => {
        if(dataTable) {
            registerEvent();
        }
    }, [dataTable]);

    const updateIncome = (incomeId, updatedIncome) => {
        api.patch(`/incomes/${incomeId}`, {data:updatedIncome})
        .then((res) => {
            handleCloseEdit();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
        })
    }

    const [deleteIncomeId, setDeleteIncomeId] = useState();

    const deleteIncome = incomeId => {
        api.delete(`/incomes/${incomeId}`)
        .then((res) => {
            handleCloseDelete();
            ToastsStore.error(res.data.message);
            dataTable.ajax.reload();
        })
    }

    const registerEvent = () => {
        $("#datatable").on("click", "tbody .editData", function (e) {
            var income = dataTable.row( $(e.target).parents('tr') ).data();
            editRow(income)
        });
        $("#datatable").on("click", "tbody .deletData", function (e) {
            setDeleteIncomeId($(e.target).attr('id'));
            setDeleteShow(true);
        });
    }
    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Income</h2>
                        <Link to="incomes/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Income</Link>
                    </div>

                    <table id="datatable" className="display" width="100%"></table>

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