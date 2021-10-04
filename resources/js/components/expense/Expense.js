import React, { Component, Fragment, useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../helpers/api";
import {
    errorResponse,
    formatDate,
    handleFilterOnDateChange,
    numberFormat
} from "../../helpers";
import { intVal } from "../../helpers";
import { ToastsStore } from "react-toasts";
import EditExpenses from "./Edit-Expense";
import DateRangePicker from "@wojtekmaj/react-daterange-picker";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faPlus,
    faFileExcel,
    faFilter
} from "@fortawesome/free-solid-svg-icons";
import ConfirmationComponent from "../ConfirmationComponent";
import Select from "react-select";
import fileSaver from "file-saver";
import ImportExpense from "./ImportExpense";

const $ = require("jquery");
$.DataTable = require("datatables.net");

function Expense() {
    const [dataTable, setDataTable] = useState(null);
    const [showEditModal, setEditShow] = useState(false);
    const [showDeleteModal, setDeleteShow] = useState(false);
    const [date, setDate] = useState([null, null]);
    const [dateRange, setDateRange] = useState([null, null]);
    const [mediums, setMediums] = useState([]);
    const [mediumsOptionForFilter, setMediumsOptionForFilter] = useState([]);
    const [selectedMediumsForFilter, setSelectedMediumsForFilter] = useState(
        null
    );
    const [selectedTagsForFilter, setSelectedTagsForFilter] = useState(null);
    const [options, setOptions] = useState([]);
    const [advanceFilter, setAdvanceFilter] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    const [showImportModal, setImportShow] = useState(false);
    const closeImportModal = () => {
        setImportShow(false);
    };
    const [errors, setErrors] = useState([]);
    const [disabled, setDisabled] = useState(false);
    const [selectedMediums, setSelectedMediums] = useState();
    const [selectedTags, setSelectedTags] = useState();

    useEffect(() => {
        initDatatables();
    }, []);

    useEffect(() => {
        if (dataTable) {
            registerEvent();
            api.get("/get-expense-mediums").then(res => {
                if (res.data.medium) {
                    setMediums(res.data.medium);
                    setMediumsOptionForFilter(
                        createMediumOption(res.data.medium)
                    );
                }
            }),
                api.get("/get-expense-tags").then(res => {
                    createTagOptions(res.data.tags);
                });
        }
    }, [dataTable]);

    const createMediumOption = mediums => {
        return mediums.map((medium, key) => {
            return {
                value: medium._id,
                label: medium.medium
            };
        });
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
                url: `/api/getExpenseData`,
                dataType: "json",
                type: "post",
                data: {
                    daterange: dateRange,
                    mediums: selectedMediumsForFilter,
                    tags: selectedTagsForFilter
                },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader(
                        "Authorization",
                        "Bearer " + localStorage.getItem("token")
                    );
                }
            },
            columns: [
                { title: "Date", data: "date" },
                { title: "Item", data: "item" },
                { title: "Amount (INR)", data: "amount" },
                {
                    title: "Medium",
                    data: "medium.medium",
                    defaultContent: "N/A"
                },
                {
                    title: "Tags",
                    data: "N/A",
                    orderable: false,
                    defaultContent: "N/A"
                },
                {
                    title: "Notes",
                    data: "notes",
                    orderable: false,
                    defaultContent: "N/A"
                },
                {
                    title: "Action",
                    data: "null",
                    orderable: false,
                    defaultContent: "N/A"
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
                    totalAmount,
                    currentPageTotalAmount;

                totalAmount = api
                    .column(2)
                    .data()
                    .reduce(function(a, b) {
                        return intVal(a) + intVal(b);
                    }, 0);
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

    const registerEvent = () => {
        $("#datatable").on("click", "tbody .editData", function(e) {
            var expense = dataTable.row($(e.target).parents("tr")).data();
            editRow(expense);
        });
        $("#datatable").on("click", "tbody .deletData", function(e) {
            setDeleteExpenseIdFunction($(e.target).attr("id"));
            setDeleteShow(true);
        });
    };
    const createTagOptions = data => {
        const tagOptions = data.map(value => {
            return {
                value: value._id,
                label: value.tag
            };
        });
        setOptions(tagOptions);
    };

    const [currentExpense, setCurrentExpense] = useState();
    const editRow = expense => {
        if (expense) {
            setErrors([]);
            setCurrentExpense(expense);
            openShowEdit();
        }
    };

    const updateExpense = (expenseId, updatedExpense) => {
        var formData = new FormData();
        Object.keys(updatedExpense[0]).map(key => {
            if (key == "date") {
                formData.append(
                    "data[" + 0 + "][" + key + "]",
                    formatDate(updatedExpense[0][key])
                );
            } else {
                if (key == "tagsArray") {
                    updatedExpense[0][key].map(value => {
                        formData.append(
                            "data[" + 0 + "][" + key + "][]",
                            value
                        );
                    });
                } else {
                    formData.append(
                        "data[" + 0 + "][" + key + "]",
                        updatedExpense[0][key]
                    );
                }
            }
        });
        formData.append("_method", "put");
        api.post(`/expenses/${expenseId}`, formData)
            .then(res => {
                handleCloseEdit();
                ToastsStore.success(res.data.message);
                dataTable.ajax.reload();
            })
            .catch(res => {
                errorResponse(res, setErrors);
            });
    };

    const [deleteExpenseId, setDeleteExpenseId] = useState();
    const setDeleteExpenseIdFunction = currentDeleteExpenseId => {
        setDeleteExpenseId(currentDeleteExpenseId);
        openShowDelete();
    };

    const deleteExpense = expenseId => {
        api.delete(`/expenses/${expenseId}`).then(res => {
            handleCloseDelete();
            ToastsStore.success(res.data.message);
            dataTable.ajax.reload();
        });
    };

    const onDateChange = datevalue => {
        handleFilterOnDateChange(datevalue, setDate, setDateRange, date);
    };

    useEffect(() => {
        if (dataTable || (date[0] && date[1])) {
            dataTable.destroy();
            initDatatables();
        }
    }, [date, selectedMediumsForFilter, selectedTagsForFilter]);

    const handleSelectChange = selectFor => event => {
        const tmp = event
            ? event.map(value => {
                  return value["value"];
              })
            : [];
        const data = event ? tmp : null;
        if (selectFor == "mediums") {
            setSelectedMediums(event);
            setSelectedMediumsForFilter(data);
        } else if (selectFor == "tags") {
            setSelectedTags(event);
            setSelectedTagsForFilter(data);
        }
    };

    const exportData = () => {
        const exportDataFilters = {
            daterange: dateRange,
            mediums: selectedMediumsForFilter,
            tags: selectedTagsForFilter
        };
        api.post("/export/expense", exportDataFilters, {
            responseType: "arraybuffer"
        })
            .then(response => {
                var blob = new Blob([response.data], {
                    type:
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
                });
                fileSaver.saveAs(blob, "expense.xlsx");
            })

            .catch(function() {
                ToastsStore.error("Something went wrong!");
            });
    };

    const importShow = () => {
        setImportShow(true);
    };

    const importData = fileState => {
        setDisabled(true);
        const formData = new FormData();
        formData.append("expenseFile", fileState.selectedFile);
        api.post("/importExpense", formData)
            .then(res => {
                setDisabled(false);
                closeImportModal();
                ToastsStore.success("Data imported successfully.");
                dataTable.ajax.reload();
            })
            .catch(() => {
                setDisabled(false);
                ToastsStore.error("Something went wrong!");
            });
    };

    const downloadSample = () => {
        api.get("/expense/download-sample", { responseType: "arraybuffer" })
            .then(res => {
                var blob = new Blob([res.data], {
                    type: "text/csv"
                });
                fileSaver.saveAs(blob, "expense.csv");
            })
            .catch(res => {
                ToastsStore.error("Something went wrong!");
            });
    };

    return (
        <div className="bg-white p-3">
            <div className="row mx-0 align-items-center">
                <h2 className="heading expenses__heading">Expenses</h2>
                <div className="ml-auto d-flex align-items-center">
                    <button
                        onClick={importShow}
                        className="btn btn--prime mr-3 d-flex align-items-center"
                    >
                        <FontAwesomeIcon
                            className="mr-2"
                            style={{ fontSize: "20px" }}
                            icon={faFileExcel}
                        />
                        <span>Import</span>
                    </button>
                    <button
                        onClick={exportData}
                        className="btn btn--prime mr-3 d-flex align-items-center"
                    >
                        <FontAwesomeIcon
                            className="mr-2"
                            style={{ fontSize: "20px" }}
                            icon={faFileExcel}
                        />
                        <span>Export</span>
                    </button>

                    <Link to="expenses/add" className="btn btn--prime ml-auto">
                        <FontAwesomeIcon className="mr-2" icon={faPlus} />
                        Add Expense
                    </Link>
                </div>
            </div>
            <div className="row mx-0 my-4 advance-filter">
                <h5 className="col-12 px-0 mb-3">
                    <Link
                        onClick={() => setAdvanceFilter(!advanceFilter)}
                        to="expenses"
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
                                <Select
                                    onChange={handleSelectChange("mediums")}
                                    isMulti
                                    options={mediumsOptionForFilter}
                                    placeholder="Select Mediums"
                                    value={selectedMediums}
                                />
                            </div>
                        </div>
                        <div className="row mx-0 mt-md-2 flex-column flex-md-row">
                            <div className="col-md-6 form-group px-0 px-lg-3 px-md-2">
                                <Select
                                    onChange={handleSelectChange("tags")}
                                    isMulti
                                    options={options}
                                    placeholder="Select Tags"
                                    value={selectedTags}
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
                <EditExpenses
                    handleCloseEdit={handleCloseEdit}
                    currentExpense={currentExpense}
                    mediums={mediums}
                    options={options}
                    updateExpense={updateExpense}
                    errors={errors}
                />
            )}
            {showDeleteModal && (
                <ConfirmationComponent
                    title="Are you sure to delete this Expense?"
                    handleCloseDelete={handleCloseDelete}
                    btnName="Delete"
                    action={() => deleteExpense(deleteExpenseId)}
                />
            )}
            {showImportModal && (
                <ImportExpense
                    handleCloseImportModal={closeImportModal}
                    importData={importData}
                    downloadSample={downloadSample}
                    disabled={disabled}
                />
            )}
        </div>
    );
}

export default Expense;
