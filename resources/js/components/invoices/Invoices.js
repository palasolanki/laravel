import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import InvoiceMessageModal from "./InvoiceMessageModal";
import ConfirmationComponent from "../ConfirmationComponent";
import EditAdminNotes from "./EditAdminNotes";
import moment from "moment";
import { downloadFile } from "../../helpers";
import config from "../../helpers/config";
const $ = require("jquery");
$.DataTable = require("datatables.net");

function Invoices(props) {
    const history = props.history;
    const [dataTable, setDataTable] = useState(null);
    const [openMsgModal, setOpenMsgModal] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const [clientName, setClientName] = useState("");
    const [deleteInvoiceId, setDeleteInvoiceId] = useState();
    const [editAdminNotesModal, setEditAdminNotesModal] = useState(false);
    const [invoiceId, setInvoiceDataId] = useState();
    const [isLoading, setIsLoading] = useState(false);
    const [adminNotes, setAdminNotes] = useState({});
    const [showMarkAsPaidModal, setMarkAsPaid] = useState(false);
    const [markAsPaidInvoiceId, setMarkAsPaidInvoiceId] = useState();

    useEffect(() => {
        initDatatables();
    }, []);

    useEffect(() => {
        if (dataTable) {
            registerEvent();
        }
    }, [dataTable]);

    const closeEditAdminNotesModal = () => setEditAdminNotesModal(false);
    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);
    const openShowMarkAsPaid = () => setMarkAsPaid(true);
    const handleCloseMarkAsPaid = () => setMarkAsPaid(false);

    const closeMsgModal = () => {
        setOpenMsgModal(false);
    };

    const initDatatables = () => {
        var table = $("#datatable").DataTable({
            serverSide: true,
            processing: true,
            scrollX:true,
            bSort: true,
            aaSorting: [[ 0, "asc" ]],
            oLanguage: {
                sSearch: "_INPUT_",
                sSearchPlaceholder: "Search"
            },
            ajax: {
                url: `/api/invoices`,
                dataType: "json",
                type: "post",
                beforeSend: function(xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("token")
                    );
                },
            },
            columns: [
                { title: "Number", data: "number" },
                {
                    title: "Client Name",
                    data: "client.name",
                    defaultContent: "N/A"
                },
                { title: "Date", data: "date" },
                { title: "Status", data: "status", defaultContent: "open" },
                {
                    title: "Last Sent At",
                    data: "last_sent_at",
                    defaultContent: "N/A"
                },
                {
                    title: "Currency",
                    data: "currency",
                    defaultContent: "N/A"

                },
                { title: 'Amount', data: "total"},
                { title: "Amount Due", data: "amount_due" },
                {
                    title: "Admin Notes",
                    data: "null",
                    defaultContent: "N/A"
                },
                {
                    title: "Action",
                    data: "null",
                    defaultContent: "N/A"
                },
                { 
                    title: "Created At", 
                    data: 'created_at',
                    visible: false
                }
            ],
            columnDefs: [
                {
                    searchable: false,
                    targets: [1, 4, 8, 9]
                },
                {
                    orderable: false,
                    targets: [1, 4, 8, 9]
                }
            ],
            rowCallback: function(row, data, index) {
                if (data.date) {
                    $("td:eq(2)", row).html(
                        moment(data.date).format("MMMM DD, YYYY")
                    );
                }
                let markPaid = ``;
                if(data.status == 'open')
                {
                    $("td:eq(3)", row).addClass('text-danger');
                    markPaid = `<button id = ${data._id} title="Mark as Paid" class="btn btn-sm btn-success ml-1 markPaid"><i class="fa fa-square-check"></i></button>`
                }
                let currencySign = config.currencies.find(currency => currency.code === data.currency).sign || "$";
                $("td:eq(6)", row).html(currencySign + Number(data.total).toFixed(2));

                $("td:eq(7)", row).html(currencySign + Number(data.amount_due).toFixed(2));

                let notes = `<a href="javascript:void(0)" id=${data._id} class="notes">Notes</a>`;
                $("td:eq(8)", row).html(notes);

                let action = `<button id=${data._id} title="Edit Invoice" class="btn btn-sm btn--prime editData"><i class="fa fa-pencil"></i></button>
                <button id=${data._id} title="Delete Invoice" class="btn btn-sm btn--cancel deleteData" ><i class="fa fa-trash"></i></button>
                <button id=${data._id} client-id=${data.client_id} title="Send Mail" class="btn btn-sm btn-info sendData"><i class="fa fa-envelope"></i></button>
                <button id=${data._id} title="Download Invoice" class="btn btn-sm btn-dark downloadInvoice"><i class="fa fa-download"></i></button>`;
                
                $("td:eq(9)", row).html(action + markPaid);

            }
        });
        setDataTable(table);
    };
    


    const registerEvent = () => {
        $("#datatable").on("click", "tbody .deleteData", function() {
            setDeleteInvoiceIdFunction($(this).attr("id"));
        });

        $("#datatable").on("click", "tbody .editData", function() {
            history.push(`invoices/edit/${$(this).attr("id")}`);
        });

        $("#datatable").on("click", "tbody .sendData", function() {
            let invoiceId = $(this).attr("id");
            let clientId = $(this).attr("client-id");
            setSendInvoiceId(invoiceId);
            getClientName(clientId);
        });

        $("#datatable").on("click", "tbody .notes", function(){
            let invoiceId = $(this).attr("id");
            let invoices = dataTable.rows().data().toArray();
            let currentInvoice = invoices.find(invoice => invoice._id === invoiceId);
            setAdminNotes({id: currentInvoice._id, admin_notes: currentInvoice.admin_notes})
            setEditAdminNotesModal(true)
            
        })

        $("#datatable").on("click", "tbody .markPaid", function() {
            setMarkAsPaidInvoiceId($(this).attr("id"));
            openShowMarkAsPaid();
        });

        $("#datatable").on("click", "tbody .downloadInvoice", function() {
            $(this).attr("disabled", 'disabled');
            downloadInvoice($(this).attr("id"));
        });
    };

    const setSendInvoiceId = invoiceId => {
        setInvoiceDataId(invoiceId);
        setOpenMsgModal(true);
    };

    const getClientName = clientId => {
        api.get(`/client/${clientId}`).then(res => {
            setClientName(res.data.client.name);
        });
    };

    const sendInvoice = (e, message) => {
        setIsLoading(true);
        api.post(`/invoices/send/${invoiceId}`, { message })
            .then(res => {
                dataTable.ajax.reload();
                setIsLoading(false);
                ToastsStore.success("Invoice emailed successfully.");
                closeMsgModal();
            })
            .catch(function(err) {
                setIsLoading(false);
                ToastsStore.error("Error ! unable to send invoice");
                console.log(err);
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

    const markAsPaid = invoiceId => {
        api.post(`/invoices/${invoiceId}/mark-paid`).then(res => {
            handleCloseMarkAsPaid();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
        });
    }

    const downloadInvoice = invoiceId => {
        api.post(`/invoices/${invoiceId}/download`, {}, { responseType: "blob" })
        .then(res => {
            downloadFile(res);
            $('.downloadInvoice').removeAttr('disabled');
            ToastsStore.success("Invoice downloaded successfully.");
        })
        .catch(err=>{
            $('.downloadInvoice').removeAttr('disabled');
            ToastsStore.error("Something went wrong! Please Download again.");
            console.log(err);
        });
    }

    const updateAdminNotes = (updatedAdminNotes) => {
        api.post(`/invoices/${updatedAdminNotes.id}/admin-notes`, { admin_note: updatedAdminNotes.admin_notes })
            .then(res => {
                dataTable.ajax.reload();
                ToastsStore.success(res.data.message);
                closeEditAdminNotesModal();
            })
            .catch(err => {
                ToastsStore.success('Unable to update Admin Note!');
                closeEditAdminNotesModal();
            });
    }

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
            {openMsgModal && (
                <InvoiceMessageModal
                    handleCloseMsgModal={closeMsgModal}
                    sendInvoice={sendInvoice}
                    isLoading={isLoading}
                    clientName={clientName}
                />
            )}
            {showDeleteModal && (
                <ConfirmationComponent
                    title="Are you sure to delete this Invoice?"
                    handleCloseDelete={handleCloseDelete}
                    btnName="Delete"
                    action={() => deleteInvoice(deleteInvoiceId)}
                />
            )}

            {showMarkAsPaidModal && (
                <ConfirmationComponent
                    title="Are you sure you want to mark invoice as paid?"
                    handleCloseDelete={handleCloseMarkAsPaid}
                    btnName="Mark As Paid"
                    confirmBtnColor="btn-success"
                    action={() => markAsPaid(markAsPaidInvoiceId)}
                />
            )}

            {editAdminNotesModal && (
                <EditAdminNotes
                closeEditAdminNotesModal={closeEditAdminNotesModal}
                updateAdminNotes={updateAdminNotes}
                AdminNotes = {adminNotes}
                />
            )}
        </div>
    );
}

export default Invoices;
