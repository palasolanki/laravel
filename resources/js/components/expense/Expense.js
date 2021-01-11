import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import { intVal } from '../../helpers';
import {ToastsStore} from 'react-toasts';
import EditExpenses from "./Edit-Expense";
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus,
    faFileExcel
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationComponent from '../ConfirmationComponent';
import Select from 'react-select';
import fileSaver from 'file-saver';
const $ = require('jquery')
$.DataTable = require('datatables.net')

function Expense() {
    const [dataTable, setDataTable] = useState(null);
    const [showEditModal, setEditShow] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const [date, setDate] = useState([null, null]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [mediums, setMediums] = useState([]);
    const [mediumsOptionForFilter, setMediumsOptionForFilter] = useState([]);
    const [selectedMediumsForFilter, setSelectedMediumsForFilter] = useState(null);
    const [selectedTagsForFilter, setSelectedTagsForFilter] = useState(null);
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
            api.get('/get-expense-mediums').then((res) => {
                if (res.data.medium) {
                    setMediums(res.data.medium);
                    setMediumsOptionForFilter(createMediumOption(res.data.medium));
                }
            }),
            api.get('/get-expense-tags').then((res) => {
                createTagOptions(res.data.tags);
            })
        }
    }, [dataTable]);

    const createMediumOption = mediums => { 
        return mediums.map((medium, key) => {
            return {
                value: medium._id,
                label: medium.medium
            }
        });
    }

    const initDatatables = () => {
        var table = $('#datatable').DataTable({
            serverSide: true,
            processing: true,
            ajax: {
                "url": `/api/getExpenseData`,
                "dataType": 'json',
                "type": 'post',
                "data": {
                    'daterange': dateRange,
                    'mediums': selectedMediumsForFilter, 
                    'tags': selectedTagsForFilter
                },
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader('Authorization',
                        "Bearer " + localStorage.getItem('token'));
                },
            },
            columns: [
                { title: "Date", data: 'date' },
                { title: "Item", data: 'item' },
                { title: "Amount (INR)", data: 'amount' },
                { title: "Medium", data: 'medium.medium', defaultContent: 'N/A' },
                { title: "Tags", data: 'tags', orderable: false },
                { title: "Notes", data: 'notes', orderable: false, defaultContent: 'N/A' },
                { title: "Action", data: 'null', orderable: false, defaultContent: 'N/A' }
            ],
            rowCallback: function( row, data, index ) {
                let action = '<button data-index="' + index + '" class="btn btn-sm btn--prime editData">Edit</button> <button id="' + data._id + '" class="btn btn-sm btn--cancel deletData" >Delete</button>'
                $('td:eq(6)', row).html( action );
                if (data.notes) {
                    let notes = (data.notes.length > 20) ? data.notes.substring(0,20) + '...' : data.notes;
                    $('td:eq(5)', row).html( notes );
                }
                if (data.tags && data.tags.length) {
                    $('td:eq(4)', row).html( data.tags.map(value => value.tag).toString() );
                }
            },
            footerCallback: function ( row, data, start, end, display ) {
                var api = this.api(), totalAmount, currentPageTotalAmount;

                totalAmount = api
                    .column( 2 )
                    .data()
                    .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

                currentPageTotalAmount = api
                    .column( 2, { page: 'current'} )
                    .data()
                    .reduce( function (a, b) {
                    return intVal(a) + intVal(b);
                }, 0 );

                var totalHtml = '<div>'+
                                'This page: <span style="font-weight:bold;">&#8377;</span>'+currentPageTotalAmount+
                            '</div>'+
                            '<div>'+
                                'All pages: <span style="font-weight:bold;">&#8377;</span>'+totalAmount+
                            '</div>';

                $( api.column( 2 ).footer() ).html(totalHtml);
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
                value: value._id,
                label: value.tag
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
                if (key == 'tagsArray') {
                    updatedExpense[0][key].map((value) => {
                        formData.append("data["+0+"]["+key+"][]", value)
                    });
                } else {
                    formData.append("data["+0+"]["+key+"]", updatedExpense[0][key]);
                }
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
            ToastsStore.success(res.data.message);
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
    }, [date, selectedMediumsForFilter, selectedTagsForFilter]);

    const handleSelectChange = selectFor => event => {
        const tmp = event ? event.map(value => {
            return value['value'];
        }) : [];
        const data = (event) ? tmp : null;
        if (selectFor == 'mediums') {
            setSelectedMediumsForFilter(data);
        } else if (selectFor == 'tags') {
            setSelectedTagsForFilter(data);
        }
    }

    const exportData = () => {
        const exportDataFilters = {
            'daterange': dateRange,
            'mediums': selectedMediumsForFilter, 
            'tags': selectedTagsForFilter,
        };
        api.post('/export/expense', exportDataFilters, {responseType: 'arraybuffer'}).then((response) => {
            var blob = new Blob([response.data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
            fileSaver.saveAs(blob, 'expense.xlsx');
        }).catch(function () {
            ToastsStore.error('Something went wrong!');
        });
    }

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
                        <div className="col-md-2">
                            <Select
                                onChange={handleSelectChange('mediums')}
                                isMulti
                                options={mediumsOptionForFilter}
                                placeholder='Select Mediums'
                            />
                        </div>
                        <div className="col-md-2">
                            <Select
                                onChange={handleSelectChange('tags')}
                                isMulti
                                options={options}
                                placeholder='Select Tags'
                            />
                        </div>
                        <div className="col-md-2">
                            <button
                                onClick={exportData}
                                className="btn btn--prime ml-auto"
                            ><FontAwesomeIcon style={{fontSize: "24px"}} icon={faFileExcel} /></button>
                        </div>
                        <Link to="expenses/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Expense</Link>
                    </div>

                    <table id="datatable" className="display" width="100%">
                    <tfoot>
                        <tr>
                            <th colSpan="2"></th>
                            <th></th>
                        </tr>
                    </tfoot>
                    </table>

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
