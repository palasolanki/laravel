import React, { useState, useEffect} from "react";
import { Link } from "react-router-dom";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faPlus} from "@fortawesome/free-solid-svg-icons";
import ConfirmationComponent from "../ConfirmationComponent";
import moment from "moment";
const $ = require("jquery");
$.DataTable = require("datatables.net");

function Invoices(props) {
    const history = props.history;
    const [dataTable, setDataTable] = useState(null);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    useEffect(() => {
        initDatatables();
    }, []);

    useEffect(() => {
        if (dataTable) {
            registerEvent();
        }
    }, [dataTable]);

    const initDatatables = () => {
        var table = $("#datatable").DataTable({
            serverSide: true,
            processing: true,
            bSort: true,
            oLanguage: {
                sSearch: "_INPUT_",
                sSearchPlaceholder: "Search"
            },
            ajax: {
                url: `/api/invoices`,
                dataType: "json",
                type: "post",
                beforeSend: function (xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("token")
                    );
                }
            },
            columns: [
                { title: "Number", data: "number" },
                { title: "Client Name", data: "client.name", defaultContent: "N/A" },
                { title: "Date", data: "date" },
                { title: "Status", data: "status", defaultContent: "open" },
                { title: "Last Send Invoice", data: 'last_sent_at', defaultContent: "N/A" },
                { title: "Amount Due", data: "amount_due" },
                {
                    title: "Action",
                    data: "null",
                    defaultContent: "N/A"
                }
            ],
            columnDefs: [
                {
                    "searchable": false,
                    "targets": [1, 4]
                },
                {
                    "orderable": false,
                    "targets": [1, 4]
                },
            ],
            rowCallback: function (row, data, index) {
                if (data.date) {
                    $("td:eq(2)", row).html(
                        moment(data.date).format('MMMM DD, YYYY')
                    );
                }

                let action =`<button id=${data._id} class="btn btn-sm btn--prime mr-2 editData">Edit</button>
                <button id=${data._id} class="btn btn-sm btn--cancel deleteData" >Delete</button>
                <button id=${data._id} class="btn btn-sm ml-2 btn-dark sendData" >Send Invoice</button>`;

                $("td:eq(6)", row).html(action);
            },
        });
        setDataTable(table);
    };

    const [deleteInvoiceId, setDeleteInvoiceId] = useState();
    const registerEvent = () => {
        $("#datatable").on("click", "tbody .deleteData", function (e) {
            setDeleteInvoiceIdFunction($(e.target).attr("id"));
            // setDeleteShow(true);
        });

        $("#datatable").on("click", "tbody .editData", function (e) {
            history.push(`invoices/edit/${$(e.target).attr("id")}`);
        });

        $('#datatable').on('click','tbody .sendData',function (e) {
            let invoice = $(e.target).attr('id');
            api.get(`/invoices/send/${invoice}`)
            .then(res => {
                dataTable.ajax.reload();
                ToastsStore.success('Invoice Mailed successfully.');

            })
            .catch(function (err) {
                console.log(err);
            });
        });
    };
    const setDeleteInvoiceIdFunction = currentDeleteInvoiceId => {
        setDeleteInvoiceId(currentDeleteInvoiceId);
        openShowDelete();
    };

    const deleteInvoice = invoiceId => {
        api.delete(`/invoices/${invoiceId}`).then(res => {
            handleCloseDelete();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
        });
    };

    return (
        <div className="bg-white p-3">
            <div className="row mx-0 align-items-center">
                <h2 className="heading invoices__heading">Invoices</h2>
                <div className="ml-auto d-flex align-items-center mb-2">
                    <Link to="invoices/add" className="btn btn--prime ml-auto">
                        <FontAwesomeIcon className="mr-2" icon={faPlus} />
                        Add Invoice
                    </Link>
                </div>
            </div>
            <div className="table-responsive-md table-invoices">
                <table id="datatable" className="display table" width="100%">
                    <tfoot>
                        <tr>
                            <th colSpan="2" />
                            <th />
                        </tr>
                    </tfoot>
                </table>
            </div>

            {showDeleteModal && (
                <ConfirmationComponent
                    title="Are you sure to delete this Invoice?"
                    handleCloseDelete={handleCloseDelete}
                    btnName="Delete"
                    action={() => deleteInvoice(deleteInvoiceId)}
                />
            )}
        </div>
    );
}

export default Invoices;
