import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import { Menu } from "react-data-grid-addons";
import { connect } from "react-redux";
import { DateEditor } from "./dateEditor/DateEditor";
import { CustomEditor } from "./customEditor/CustomEditor";
import ClientEditor from "./clientEditor/ClientEditor";
import MediumEditor from "./mediumEditor/MediumEditor";
import axios from 'axios';
import api from '../../helpers/api';
import {
    getProjectData,
    setProjectData,
    setRows,
    updateTabRows,
    deleteRow

} from "../../store/actions/project";

const { ContextMenu, MenuItem, SubMenu, ContextMenuTrigger } = Menu;

function ExampleContextMenu({
    idx,
    id,
    rowIdx,
    onRowDelete,
    onRowInsertAbove,
    onRowInsertBelow
}) {
    return (
        <ContextMenu id={id}>
            <MenuItem data={{ rowIdx, idx }} onClick={onRowDelete}>
                Delete Row
            </MenuItem>
            <SubMenu title="Insert Row">
                <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertAbove}>
                    Above
                </MenuItem>
                <MenuItem data={{ rowIdx, idx }} onClick={onRowInsertBelow}>
                    Below
                </MenuItem>
            </SubMenu>
        </ContextMenu>
    );
}

class Project extends Component {
    constructor(props) {
        super(props);
        this.selectedRows = null;
        this.fromRow = null;
        this.axiosCancelSource = null;
        this.state = {
            rows: []
        };
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
        this.addRow = this.addRow.bind(this);
        this.onRowDelete = this.onRowDelete.bind(this);
        this.onRowInsertAbove = this.onRowInsertAbove.bind(this);
        this.onRowInsertBelow = this.onRowInsertBelow.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.onkeypress = this.onkeypress.bind(this);
    }

    componentDidMount() {
        this.axiosCancelSource = axios.CancelToken.source();
        api
            .get(`/tab/${this.props.match.params.id}`, { cancelToken: this.axiosCancelSource.token })
            .then((response) => {
                this.props.getProjectData(response, this.props.match.params.id);
            })
            .catch((res) => {

            })
    }
    componentWillUnmount() {
        document.removeEventListener('mousedown', this.onComplete, true);
        this.axiosCancelSource.cancel('Component unmounted.')
    }

    onGridRowsUpdated({ fromRow, toRow, updated }) {
        const rows = this.props.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        const newRow = rows.filter((row, index) => {
            if (index === fromRow) {
                return row;
            }
        });

        if (newRow.length > 0) {
            this.saveRows(rows, newRow[0]);
        }
    }

    addRow() {
        const rows = this.props.rows.map((row, i) => {
            return { ...row, index: i + 1 };
        });
        this.props.setRows([...rows, { index: '+' }]);
    }

    onRowDelete(rowIdx) {

        const { rows, tabId } = this.props;

        const row = rows.filter((row, index) => {
            if (index === rowIdx) {
                return row;
            }
        });

        this.props.deleteRow(tabId, row[0].id);
    }

    insertRows(rowIdx) {
        const { rows } = this.props;
        let nextRows = [...rows];
        nextRows.splice(rowIdx, 0, { index: '-' });

        nextRows = this.reIndexRows(nextRows);
        this.saveRows(nextRows);
    }

    reIndexRows(nextRows) {
        return nextRows.map((row, i) => {
            return { ...row, index: (nextRows.length === i + 1) ? '+' : i + 1 };
        });
    }

    saveRows(rows, nextRows) {
        // const savingRows = [...nextRows];
        this.props.updateTabRows(this.props.tabId, nextRows);
        this.props.setRows(rows);
    }

    onRowInsertAbove(rowIdx) {
        this.insertRows(rowIdx);
    }

    onRowInsertBelow(rowIdx) {
        this.insertRows(rowIdx);
    }
    onUpdate(selectedRange) {
        this.updateSelectedRows(selectedRange);
    }

    updateSelectedRows(selectedRange) {
        const { rows, columns } = this.props;

        this.selectedRows = rows.map((row, index) => {
            let columnIndex;
            let topLeftRow = selectedRange.topLeft.rowIdx;
            let topLeftColumn = selectedRange.topLeft.idx;
            let bottomRightRow = selectedRange.bottomRight.rowIdx;
            let bottomRightColumn = selectedRange.bottomRight.idx;

            if (index >= topLeftRow && index <= bottomRightRow) {
                for (topLeftRow; topLeftRow <= bottomRightRow; topLeftRow++) {
                    for (topLeftColumn; topLeftColumn <= bottomRightColumn; topLeftColumn++) {
                        columnIndex = columns[topLeftColumn].key;
                        row[columnIndex] = '';
                    }
                }
            }
            return row;
        });
    }

    onkeypress(e) {
        if (e.keyCode === 46 && this.selectedRows) {
            this.saveRows(this.selectedRows);
        }
    }

    render() {
        const { rows, columns } = this.props;
        let newColumn = columns.map((column) => {
            if (column.key === 'index') {
                column = {
                    ...column, editable: false, cellClass: 'is-disable',
                }
            }
            else if (column.key === 'paid_date') {
                column = { ...column, 'editor': DateEditor }
            }
            else if (column.key === 'paid_by') {
                column = { ...column, 'editor': DateEditor }
            }
            else if (column.key === 'client_id') {
                column = { ...column, 'editor': ClientEditor }
            }
            else if (column.key === 'medium') {
                column = { ...column, 'editor': MediumEditor }
            }
            else {
                column = { ...column, 'editor': CustomEditor }
            }

            return column;

        })

        return (
            <Fragment>
                <div className="grid-table mt-5">
                    <ReactDataGrid
                        columns={newColumn}
                        rowGetter={i => rows[i]}
                        rowsCount={rows.length}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}
                        emptyRowsView={() => (
                            <NoRows addColumns={this.addRows} />
                        )}
                        onGridKeyUp={this.onkeypress}
                        cellRangeSelection={{
                            onStart: this.onStart,
                            onUpdate: this.onUpdate,
                            onComplete: this.onComplete,
                        }}
                        rowRenderer={props => (
                            <RowRenderer
                                {...props}
                                length={rows.length}
                                addRow={this.addRow}
                            />
                        )}
                        minHeight={window.innerHeight - 120}
                        contextMenu={
                            <ExampleContextMenu
                                onRowDelete={(e, { rowIdx }) => this.onRowDelete(rowIdx)}
                                onRowInsertAbove={(e, { rowIdx }) => this.onRowInsertAbove(rowIdx)}
                                onRowInsertBelow={(e, { rowIdx }) => this.onRowInsertBelow(rowIdx + 1)}
                            />
                        }
                        RowsContainer={ContextMenuTrigger}
                    />
                </div>
            </Fragment >
        );
    }
}

const RowRenderer = ({ renderBaseRow, ...props }) => {

    if (props.idx === props.length - 1) {

        return (
            <div style={{ cursor: "pointer" }} onClick={props.addRow}>
                {renderBaseRow(props)}
            </div>
        );
    }

    return <div>{renderBaseRow(props)}</div>;
};

const NoRows = props => null;

const mapStateToProps = state => {
    return {
        tab: state.project.tab,
        rows: state.project.rows,
        tabId: state.project.tabId,
        columns: state.project.columns
    };
};

const mapDispatchToProps = dispatch => {
    return {
        getProjectData: (data, tabId) => dispatch(getProjectData(data, tabId)),
        setProjectData: data => dispatch(setProjectData(data)),
        setRows: data => dispatch(setRows(data)),
        updateTabRows: (tabId, data) => dispatch(updateTabRows(tabId, data)),
        deleteRow: (tabId, rowId) => dispatch(deleteRow(tabId, rowId))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);
