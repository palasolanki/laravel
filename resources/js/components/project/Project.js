import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import { Menu } from "react-data-grid-addons";
import { connect } from "react-redux";
import { DateEditor } from "./dateEditor/DateEditor";
import { CustomEditor } from "./customEditor/CustomEditor";

import {
    getProjectData,
    setProjectData,
    setRows,
    updateTabRows

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
        this.state = {
            rows: []
        };
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
        this.addRow = this.addRow.bind(this);
        this.onRowDelete = this.onRowDelete.bind(this);
        this.onRowInsertAbove = this.onRowInsertAbove.bind(this);
        this.onRowInsertBelow = this.onRowInsertBelow.bind(this);
        //   this.onStart = this.onStart.bind(this);
        //   this.onUpdate = this.onUpdate.bind(this);
        this.onComplete = this.onComplete.bind(this);
        this.updateSelectedRows = this.updateSelectedRows.bind(this);
        this.onkeypress = this.onkeypress.bind(this);
    }

    componentDidMount() {
        this.props.getProjectData(this.props.match.params.id);
    }

    onGridRowsUpdated({ fromRow, toRow, updated }) {

        const rows = this.props.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }

        this.saveRows(rows);
    }

    addRow() {
        const rows = this.props.rows.map((row, index) => {
            return { ...row, id: index + 1 };
        });

        this.props.setRows([...rows, { id: '+' }]);
    }

    onRowDelete(rowIdx) {

        const { rows } = this.props;

        let nextRows = [...rows];
        nextRows.splice(rowIdx, 1);

        nextRows = this.reIndexRows(nextRows);

        this.saveRows(nextRows);
    }

    insertRows(rowIdx) {
        const { rows } = this.props;
        let nextRows = [...rows];
        nextRows.splice(rowIdx, 0, { id: '-' });

        nextRows = this.reIndexRows(nextRows);

        this.saveRows(nextRows);
    }

    reIndexRows(nextRows) {
        return nextRows.map((row, index) => {
            return { ...row, id: (nextRows.length === index + 1) ? '+' : index + 1 };
        });
    }

    saveRows(nextRows) {
        this.props.setRows(nextRows);
        const savingRows = [...nextRows];
        updateTabRows(this.props.tabId, savingRows);
    }

    onRowInsertAbove(rowIdx) {
        this.insertRows(rowIdx);
    }

    onRowInsertBelow(rowIdx) {
        this.insertRows(rowIdx);
    }

    onComplete(e) {
        this.updateSelectedRows(e);
    }

    updateSelectedRows(selectedRange) {
        const { rows, columns } = this.props;
        const tempRows = [{}, rows];

        this.selectedRows = tempRows.map((row, index) => {
            let columnIndex;
            let i = selectedRange.topLeft.rowIdx;
            let j = selectedRange.topLeft.idx;
            let k = selectedRange.bottomRight.rowIdx;
            let l = selectedRange.bottomRight.idx;
            if (index === i) {
                for (i; i <= k; i++) {
                    for (j; j <= l; j++) {
                        columnIndex = columns[j].key;
                    }
                    row[columnIndex] = '';
                }
            }
            return row;
        });
    }

    onkeypress(e) {
        if (e.keyCode === 46) {
            this.saveRows(this.selectedRows);
        }
    }

    render() {
        const { rows, columns } = this.props;
        let newColumn = columns.map((column) => {
            if (column.key === 'paid_date') {
                column = { ...column, 'editor': DateEditor }
            }
            else if (column.key === 'paid_by') {
                column = { ...column, 'editor': DateEditor }
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
                            <NoRows addCoumns={this.addRows} />
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
                        minHeight={window.visualViewport.height - 56}
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
            </Fragment>
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
        getProjectData: tabId => dispatch(getProjectData(tabId)),
        setProjectData: data => dispatch(setProjectData(data)),
        setRows: data => dispatch(setRows(data))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Project);
