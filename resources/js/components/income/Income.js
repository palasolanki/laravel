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

function Income(props) {
    const incomesData = [];
    const [dataTable, setDataTable] = useState(null);
    // const [incomes, setIncomes] = useState(incomesData);
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
            setIncomes(res.data.data);
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
        }),
        registerEvent();
    }, [] );
    const [currentIncome, setCurrentIncome] = useState()
    const editRow = income => {
        setCurrentIncome(income)
        openShowEdit();
    }

    const updateIncome = (incomeId, updatedIncome) => {
        api.patch(`/incomes/${incomeId}`, {data:updatedIncome})
        .then((res) => {
            // setIncomes(incomes.map(income => (income._id === incomeId ? res.data.updateIncome : income)))
            handleCloseEdit();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
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
            handleCloseDelete();
            ToastsStore.error(res.data.message);
            dataTable.ajax.reload();
        })
    }

    const getClientName = (clientId) => {
        return clients.map(client => {
            return (client._id == clientId) ? client.name : ''
        })
    }
    const registerEvent = () => {
        var table = $('#datatable').DataTable();
        setDataTable(table);
        $("#datatable").on("click", "tbody .editData", function (e) {
            var income = table.row( $(e.target).parents('tr') ).data();
            editRow(income)
        });

        $("#datatable").on("click", "tbody .deletData", function (e) {
            setDeleteIncomeIdFunction($(e.target).attr('id'));
        });

    }
    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Income</h2>
                        <Link to="incomes/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Income</Link>
                    </div>

                    <table id="datatable" className="display" width="100%" ref={props.inputRef}></table>

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

export default class DataTable extends React.Component {
    componentDidMount() {
        this.el = $(this.el).DataTable({
            ajax: {
                "url": 'http://dev.expensetracker.com/api/incomes',
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
        })
    }

    render() {
      return (
        <Income
          inputRef={el => this.el = el}
        />
      );
    }
}