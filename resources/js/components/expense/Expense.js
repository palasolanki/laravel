import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import EditExpenses from "./Edit-Expense";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';
const $ = require('jquery')
$.DataTable = require('datatables.net')

function Expense() {
    const [dataTable, setDataTable] = useState(null);
    const [showEditModal, setEditShow] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const [date, setDate] = useState([null, null]);

    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    useEffect( () => {
        initDatatables();
    }, [] );

    useEffect(() => {
        if(dataTable) {
            registerEvent();
        }
    }, [dataTable]);

    const initDatatables = () => {
        var table = $('#datatable').DataTable({
            serverSide: true,
            processing: true,
            ajax: {
                "url": `/api/getExpenseData`,
                "dataType": 'json',
                "type": 'post',
                "data": {'daterange': date},
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader('Authorization',
                        "Bearer " + localStorage.getItem('token'));
                },
            },
            columns: [
                { title: "Date", data: 'date' },
                { title: "Item", data: 'item' },
                { title: "Amount", data: 'amount' },
                { title: "Medium", data: 'mediumvalue' },
                { title: "Tags", data: 'tags', orderable: false },
                { title: "Action", data: 'null', orderable: false, defaultContent: 'N/A' }
            ],
            rowCallback: function( row, data, index ) {
                let action = '<button data-index="' + index + '" class="btn btn-sm btn--prime editData">Edit</button> <button id="' + data._id + '" class="btn btn-sm btn--cancel deletData" >Delete</button>'
                $('td:eq(5)', row).html( action );
            }
        });
        setDataTable(table);
    }

    const registerEvent = () => {
        $("#datatable").on("click", "tbody .editData", function (e) {
            var expense = dataTable.row( $(e.target).parents('tr') ).data();
            editRow(expense)
        });
        $("#datatable").on("click", "tbody .deletData", function (e) {
            setDeleteExpenseIdFunction($(e.target).attr('id'));
            setDeleteShow(true);
        });
    }

    const [currentExpense, setCurrentExpense] = useState()
    const editRow = expense => {
        if (expense) {
            setCurrentExpense(expense)
            openShowEdit();
        }
    }

    const updateExpense = (expenseId, updatedExpense) => {
        var formData = new FormData();
        Object.keys(updatedExpense[0]).map((key) => {
                formData.append("data["+0+"]["+key+"]", updatedExpense[0][key]);
        });
        formData.append('_method', 'put');
        api.post(`/expenses/${expenseId}`, formData)
        .then((res) => {
            handleCloseEdit();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
        })
    }

    const [deleteExpenseId, setDeleteExpenseId] = useState();
    const setDeleteExpenseIdFunction = currentDeleteExpenseId =>{
        setDeleteExpenseId(currentDeleteExpenseId);
        openShowDelete();
    }

    const deleteExpense = expenseId => {
        api.delete(`/expenses/${expenseId}`).then((res) => {
            handleCloseDelete();
            ToastsStore.error(res.data.message);
            dataTable.ajax.reload();
        })
    }

    const onDateChange = datevalue => {
        setDate(datevalue);
    }

    useEffect(() => {
        if(dataTable && date) {
            dataTable.destroy();
            initDatatables();
        }
    }, [date]);

    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Expenses</h2>
                        <div className="col-md-2">
                            <DateRangePicker
                                onChange={onDateChange}
                                value={date}
                            />
                        </div>
                        <Link to="expenses/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Expense</Link>
                    </div>

                    <table id="datatable" className="display" width="100%"></table>

                    {showEditModal && <EditExpenses handleCloseEdit={handleCloseEdit} currentExpense={currentExpense} updateExpense={updateExpense} />}
                    {showDeleteModal &&
                        <div>
                            <div style={{ display: 'block' }} className="modal">
                                <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                                <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                                    <div style={{textAlign: 'center',}}>
                                        <h3 className="heading">Are you sure to delete this expense?</h3>
                                    </div>
                                    <div style={{textAlign: 'center',}} className="modal-body">
                                            <button style={{color: '#fff',}} className="btn btn--prime mr-1" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                                            <button className="btn btn--cancel ml-1" onClick={() => deleteExpense(deleteExpenseId)}>Delete</button>
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
