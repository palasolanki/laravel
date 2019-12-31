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
import ConfirmationComponent from '../ConfirmationComponent';
const $ = require('jquery')
$.DataTable = require('datatables.net')

function Expense() {
    const [dataTable, setDataTable] = useState(null);
    const [showEditModal, setEditShow] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const [date, setDate] = useState([null, null]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [mediums, setMediums] = useState([]);
    const [options, setOptions] = useState([]);

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
            api.get('/getExpenseMediumList').then((res) => {
                if (res.data.medium) {
                    setMediums(res.data.medium);
                }
            }),
            api.get('/getTagList').then((res) => {
                createTagOptions(res.data.tags);
            })
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
                "data": {'daterange': dateRange},
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
        if (expense) {
            setCurrentExpense(expense)
            openShowEdit();
        }
    }

    const updateExpense = (expenseId, updatedExpense) => {
        var formData = new FormData();
        Object.keys(updatedExpense[0]).map((key) => {
            if(key == 'date') {
                const isoDate = new Date(updatedExpense[0][key]).toISOString();
                formData.append("data["+0+"]["+key+"]", isoDate)
            } else {
                formData.append("data["+0+"]["+key+"]", updatedExpense[0][key]);
            }
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
        const dateForDateRangePicker = (datevalue) ? datevalue : [null, null];
        const data = (datevalue) ? [datevalue[0].toISOString(), datevalue[1].toISOString()] : [null, null];
        setDate(dateForDateRangePicker);
        setDateRange(data);
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

                    {showEditModal && <EditExpenses
                                        handleCloseEdit={handleCloseEdit}
                                        currentExpense={currentExpense}
                                        mediums={mediums}
                                        options={options}
                                        updateExpense={updateExpense}
                                    />}
                    {showDeleteModal && <ConfirmationComponent
                                            title="Are you sure to delete this Expense?"
                                            handleCloseDelete={handleCloseDelete}
                                            btnName="Delete"
                                            action={() => deleteExpense(deleteExpenseId)}
                                        /> }
                </div>
            )
}

export default Expense;
