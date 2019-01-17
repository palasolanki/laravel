import React, { Component, Fragment } from "react";
import ReactDataGrid from "react-data-grid";
import { connect } from "react-redux";
import {
    getProjectData,
    setProjectData,
    setRows,
    updateTabRows

} from "../../store/actions/project";

class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows: []
        };
        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
        this.addRow = this.addRow.bind(this);
    }

    componentDidMount() {
        this.props.getProjectData(this.props.match.params.id);
    }

    onGridRowsUpdated({ fromRow, toRow, updated }) {
        const rows = this.props.rows.slice();
        for (let i = fromRow; i <= toRow; i++) {
            rows[i] = { ...rows[i], ...updated };
        }
        this.props.setRows(rows);
        //save 
        const savingRows = [...rows];
        savingRows.pop();
        updateTabRows(this.props.tabId, savingRows);
    }


    addRow() {
        const rows = this.props.rows.map((row, index) => {
            return { ...row, id: index + 1 };
        });

        this.props.setRows([...rows, { id: <strong>+</strong> }]);
    }

    render() {
        const { rows, columns } = this.props;

        return (
            <Fragment>
                <div className="grid-table mt-5">
                    <ReactDataGrid
                        columns={columns}
                        rowGetter={i => rows[i]}
                        rowsCount={rows.length}
                        onGridRowsUpdated={this.onGridRowsUpdated}
                        enableCellSelect={true}
                        emptyRowsView={() => (
                            <NoRows addCoumns={this.addRows} />
                        )}
                        rowRenderer={props => (
                            <RowRenderer
                                {...props}
                                length={rows.length}
                                addRow={this.addRow}
                            />
                        )}
                        minHeight={window.visualViewport.height - 56}
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
