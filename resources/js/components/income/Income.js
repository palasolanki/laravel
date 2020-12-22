import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import EditIncomes from "./Edit-Income";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import DateRangePicker from '@wojtekmaj/react-daterange-picker';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationComponent from '../ConfirmationComponent';
const $ = require('jquery')
$.DataTable = require('datatables.net')

export default function Income() {
    const [dataTable, setDataTable] = useState(null);
    const [date, setDate] = useState([null, null]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [clients, setClients] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [filterClient, setFilterClient] = useState('all');
    const [showEditModal, setEditShow] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const [showDeleteModal, setDeleteShow] = useState(false);
    const handleCloseDelete = () => setDeleteShow(false);

    const [currentIncome, setCurrentIncome] = useState()
    const editRow = income => {
        if(income) {
            setCurrentIncome(income)
            openShowEdit();
        }
    }
    const initDatatables = () => {
        var table = $('#datatable').DataTable({
            serverSide: true,
            processing: true,
            ajax: {
                "url": `/api/getIncomeData`,
                "dataType": 'json',
                "type": 'post',
                "data": {'daterange': dateRange, 'client': filterClient},
                "beforeSend": function (xhr) {
                    xhr.setRequestHeader('Authorization',
                        "Bearer " + localStorage.getItem('token'));
                },
            },
            columns: [
                { title: "Date", data: 'date' },
                { title: "Client", data: 'clientname' },
                { title: "Amount", data: 'amount' },
                { title: "Medium", data: 'mediumvalue' },
                { title: "notes", data: 'notes', defaultContent: 'N/A'},
                { title: "Action", data: 'null', defaultContent: 'N/A', orderable: false }
            ],
            rowCallback: function( row, data, index ) {
                let action = '<button data-index="' + index + '" class="btn btn-sm btn--prime editData">Edit</button> <button id="' + data._id + '" class="btn btn-sm btn--cancel deletData" >Delete</button>'
                $('td:eq(5)', row).html( action );
                if (data.notes) {
                    let notes = (data.notes.length > 20) ? data.notes.substring(0,10) + '...' : data.notes;
                    $('td:eq(4)', row).html( notes );
                }
            }
        });
        setDataTable(table);
    }

    useEffect(() => {
        initDatatables();
        api.get('/getClients')
        .then((res) => {
            setClients(res.data.clients);
        })
        api.get('/getIncomeMediumList')
        .then((res) => {
            setMediums(res.data.medium);
        })
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
            ToastsStore.success(res.data.message);
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
    const onDateChange = datevalue => {
        const dateForDateRangePicker = (datevalue) ? datevalue : [null, null];
        const data = (datevalue) ? [datevalue[0].toISOString(), datevalue[1].toISOString()] : [null, null];
        setDate(dateForDateRangePicker);
        setDateRange(data);
    }
    const handleClientFilterChange = () => {
        setFilterClient(event.target.value)
    }

    useEffect(() => {
        if(dataTable && date) {
            dataTable.destroy();
            initDatatables();
        }
    }, [date, filterClient]);

    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Income</h2>
                        <div className="col-md-2">
                            <DateRangePicker
                                onChange={onDateChange}
                                value={date}
                            />
                        </div>
                        <div className="col-md-2">
                            <select className="form-control" onChange={handleClientFilterChange} value={filterClient}>
                                <option value="all">All Clients</option>
                                {
                                    clients && clients.map((client) =>
                                        <option value={client._id} key={client._id}>{client.name}</option>
                                    )
                                }
                            </select>
                        </div>
                        <Link to="incomes/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Income</Link>
                    </div>

                    <table id="datatable" className="display" width="100%"></table>

                    {showEditModal && <EditIncomes
                                        handleCloseEdit={handleCloseEdit}
                                        currentIncome={currentIncome}
                                        mediums={mediums}
                                        clients={clients}
                                        updateIncome={updateIncome}
                                    />}
                    {showDeleteModal && <ConfirmationComponent
                                            title="Are you sure to delete this Income?"
                                            handleCloseDelete={handleCloseDelete}
                                            btnName="Delete"
                                            action={() => deleteIncome(deleteIncomeId)}
                                        /> }
                </div>
            )
}