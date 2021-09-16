import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../helpers/api";
import { formatDate, intVal } from "../../helpers";
import { numberFormat } from "../../helpers";
import { ToastsStore } from "react-toasts";
import EditIncomes from "./Edit-Income";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { faFilter, faPlus } from "@fortawesome/free-solid-svg-icons";
import ConfirmationComponent from "../ConfirmationComponent";
import Select from "react-select";
const $ = require("jquery");
$.DataTable = require("datatables.net");

export default function Income() {
    const [dataTable, setDataTable] = useState(null);
    const [date, setDate] = useState([null, null]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [clients, setClients] = useState([]);
    const [mediums, setMediums] = useState([]);
    const [mediumsOptionForFilter, setMediumsOptionForFilter] = useState([]);
    const [selectedMediumsForFilter, setSelectedMediumsForFilter] = useState(
        null
    );
    const [selectedTagsForFilter, setSelectedTagsForFilter] = useState(null);
    const [filterClient, setFilterClient] = useState("all");
    const [showEditModal, setEditShow] = useState(false);
    const [tagOptions, setTagOptions] = useState([]);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);
    const [advanceFilter, setAdvanceFilter] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const handleCloseDelete = () => setDeleteShow(false);
    const [errors, setErrors] = useState([]);

    const [currentIncome, setCurrentIncome] = useState();

    var totalAmount = 0;

    const editRow = income => {
        if (income) {
            setCurrentIncome(income);
            openShowEdit();
        }
    };
    const initDatatables = () => {
        var table = $("#datatable").DataTable({
            serverSide: true,
            processing: true,
            oLanguage: {
                sSearch: "",
                sSearchPlaceholder: "Search"
            },
            ajax: {
                url: `/api/getIncomeData`,
                dataType: "json",
                type: "post",
                data: {
                    daterange: dateRange,
                    client: filterClient,
                    mediums: selectedMediumsForFilter,
                    tags: selectedTagsForFilter
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("token")
                    );
                },
                dataSrc: function(json) {
                    totalAmount = json.totalAmount;
                    return json.data;
                }
            },
            columns: [
                { title: "Date", data: "date", searchable: false },
                {
                    title: "Client",
                    data: "client.name",
                    defaultContent: "N/A"
                },
                { title: "Amount (INR)", data: "amount" },
                {
                    title: "Medium",
                    data: "medium.medium",
                    defaultContent: "N/A"
                },
                {
                    title: "Tags",
                    data: "tags",
                    defaultContent: "N/A",
                    orderable: false,
                    searchable: false
                },
                {
                    title: "Notes",
                    data: "notes",
                    defaultContent: "N/A",
                    orderable: false
                },
                {
                    title: "Action",
                    data: "null",
                    defaultContent: "N/A",
                    orderable: false
                }
            ],
            rowCallback: function(row, data, index) {
                let action =
                    '<button data-index="' +
                    index +
                    '" class="btn btn-sm btn--prime editData">Edit</button> <button id="' +
                    data._id +
                    '" class="btn btn-sm btn--cancel deletData" >Delete</button>';
                $("td:eq(6)", row).html(action);
                if (data.notes) {
                    let notes =
                        data.notes.length > 20
                            ? data.notes.substring(0, 20) + "..."
                            : data.notes;
                    $("td:eq(5)", row).html(notes);
                }
                if (data.tags && data.tags.length) {
                    $("td:eq(4)", row).html(
                        data.tags.map(value => value.tag).toString()
                    );
                }
                if (data.amount) {
                    $("td:eq(2)", row).html(numberFormat(data.amount));
                }
            },
            footerCallback: function(row, data, start, end, display) {
                var api = this.api(),
                    currentPageTotalAmount;

                currentPageTotalAmount = api
                    .column(2, { page: "current" })
                    .data()
                    .reduce(function(a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);

                var totalHtml =
                    "<div>" +
                    'This page: <span style="font-weight:bold;">&#8377;</span>' +
                    numberFormat(currentPageTotalAmount) +
                    "</div>" +
                    "<div>" +
                    'All pages: <span style="font-weight:bold;">&#8377;</span>' +
                    numberFormat(totalAmount) +
                    "</div>";

                $(api.column(2).footer()).html(totalHtml);
            }
        });
        setDataTable(table);
    };

    useEffect(() => {
        initDatatables();
        api.get("/getClients").then(res => {
            setClients(res.data.clients);
        });
        api.get("/get-income-mediums").then(res => {
            setMediums(res.data.medium);
            setMediumsOptionForFilter(createMediumOption(res.data.medium));
        });
        api.get("/get-income-tags").then(res => {
            createTagOptions(res.data.tags);
        });
    }, []);

    const createTagOptions = data => {
        const options = data.map(value => {
            return {
                value: value._id,
                label: value.tag
            };
        });
        setTagOptions(options);
    };

    useEffect(() => {
        if (dataTable) {
            registerEvent();
        }
    }, [dataTable]);

    const updateIncome = (incomeId, updatedIncome) => {
        const tempIncomeData = updatedIncome.map((incomeItem, key) => {
            return { ...incomeItem, date: formatDate(incomeItem.date) };
        });
        api.patch(`/incomes/${incomeId}`, { data: tempIncomeData })
            .then(res => {
                handleCloseEdit();
                ToastsStore.success(res.data.message);
                dataTable.ajax.reload();
            })
            .catch(res => {
                const tmp = res.response.data.errors;
                for (const key in tmp) {
                    if (!errors.includes(tmp[key][0])) {
                        errors.push(tmp[key][0]);
                    }
                }
                setErrors([...errors]);
            });
    };

    const [deleteIncomeId, setDeleteIncomeId] = useState();

    const deleteIncome = incomeId => {
        api.delete(`/incomes/${incomeId}`).then(res => {
            handleCloseDelete();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
        });
    };

    const registerEvent = () => {
        $("#datatable").on("click", "tbody .editData", function(e) {
            var income = dataTable.row($(e.target).parents("tr")).data();
            editRow(income);
        });
        $("#datatable").on("click", "tbody .deletData", function(e) {
            setDeleteIncomeId($(e.target).attr("id"));
            setDeleteShow(true);
        });
    };
    const onDateChange = datevalue => {
        const dateForDateRangePicker = datevalue ? datevalue : [null, null];
        const data = datevalue
            ? [datevalue[0].toISOString(), datevalue[1].toISOString()]
            : [null, null];
        setDate(dateForDateRangePicker);
        setDateRange(data);
    };
    const handleClientFilterChange = event => {
        setFilterClient(event.target.value);
    };

    useEffect(() => {
        if (dataTable && date) {
            dataTable.destroy();
            initDatatables();
        }
    }, [date, filterClient, selectedMediumsForFilter, selectedTagsForFilter]);

    const createMediumOption = mediums => {
        return mediums.map((medium, key) => {
            return {
                value: medium._id,
                label: medium.medium
            };
        });
    };

    const handleSelectChange = selectFor => event => {
        const tmp = event
            ? event.map(value => {
                  return value["value"];
              })
            : [];
        const data = event ? tmp : null;
        if (selectFor == "mediums") {
            setSelectedMediumsForFilter(data);
        } else if (selectFor == "tags") {
            setSelectedTagsForFilter(data);
        }
    };
    return (
        <div className="bg-white p-3">
            <div className="row mx-0 align-items-center">
                <h2 className="heading">Income</h2>
                <div className="ml-auto">
                    <Link to="incomes/add" className="btn btn--prime">
                        <FontAwesomeIcon className="mr-2" icon={faPlus} />
                        Add Income
                    </Link>
                </div>
            </div>

            <div className="row mx-0 my-4 advance-filter">
                <h5 className="col-12 px-0 mb-3">
                    <Link
                        onClick={() => setAdvanceFilter(!advanceFilter)}
                        to="incomes"
                    >
                        <FontAwesomeIcon
                            size="sm"
                            className="mr-2"
                            icon={faFilter}
                        />
                        Advanced Filters
                    </Link>
                </h5>
                {advanceFilter && (
                    <div className="col-xl-6 col-md-10 border p-xl-4 p-3 mb-3">
                        <div className="row mx-0 mt-2 flex-column flex-md-row">
                            <div className="col form-group px-0 px-lg-3 px-md-2">
                                <DateRangePicker
                                    onChange={onDateChange}
                                    value={date}
                                />
                            </div>
                            <div className="col form-group px-0 px-lg-3 px-md-2">
                                <select
                                    className="form-control"
                                    onChange={handleClientFilterChange}
                                    value={filterClient}
                                >
                                    <option value="all">All Clients</option>
                                    {clients &&
                                        clients.map(client => (
                                            <option
                                                value={client._id}
                                                key={client._id}
                                            >
                                                {client.name +
                                                    ` (` +
                                                    client.company_name +
                                                    `)`}
                                            </option>
                                        ))}
                                </select>
                            </div>
                        </div>
                        <div className="row mx-0 mt-md-2 flex-column flex-md-row">
                            <div className="col form-group px-0 px-lg-3 px-md-2">
                                <Select
                                    onChange={handleSelectChange("mediums")}
                                    isMulti
                                    options={mediumsOptionForFilter}
                                    placeholder="Select Mediums"
                                />
                            </div>
                            <div className="col form-group px-0 px-lg-3 px-md-2">
                                <Select
                                    onChange={handleSelectChange("tags")}
                                    isMulti
                                    options={tagOptions}
                                    placeholder="Select Tags"
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="table-responsive-md table-income-expense">
                <table id="datatable" className="display table" width="100%">
                    <tfoot>
                        <tr>
                            <th colSpan="2" />
                            <th />
                        </tr>
                    </tfoot>
                </table>
            </div>
            {showEditModal && (
                <EditIncomes
                    handleCloseEdit={handleCloseEdit}
                    currentIncome={currentIncome}
                    mediums={mediums}
                    clients={clients}
                    tagOptions={tagOptions}
                    updateIncome={updateIncome}
                    errors={errors}
                />
            )}
            {showDeleteModal && (
                <ConfirmationComponent
                    title="Are you sure to delete this Income?"
                    handleCloseDelete={handleCloseDelete}
                    btnName="Delete"
                    action={() => deleteIncome(deleteIncomeId)}
                />
            )}
        </div>
    );
}
