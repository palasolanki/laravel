import React, { Component, Fragment } from 'react';
import ReactDataGrid from 'react-data-grid';
import { connect } from 'react-redux';

const columns = [
  { key: "id", name: "ID", editable: true },
  { key: "title", name: "Title", editable: true },
  { key: "paid_date", name: "Paid Date", editable: true },
  { key: "complete", name: "Complete", editable: true },
  { key: "paid_by", name: "Paid By", editable: true },
  { key: "medium", name: "Medium", editable: true },
  { key: "comment", name: "Comment", editable: true }
];

class Project extends Component {
  constructor(props) {
    super(props);
    this.state = {
         rows: []
    }
    this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
  }

  componentDidUpdate() {

  }
  onGridRowsUpdated({ fromRow, toRow, updated }) {
    this.setState(state => {
      const rows = state.rows.slice();
      for (let i = fromRow; i <= toRow; i++) {
        rows[i] = { ...rows[i], ...updated };
      }
      return { rows };
    });
  };

  render() {
    const { rows } = this.props;

    return (
      <Fragment>
        <div className="grid-table mt-5">
          {
            rows.length
            ? <ReactDataGrid
                columns={columns}
                rowGetter={i => this.props.rows[i]}
                rowsCount={3}
                onGridRowsUpdated={this.onGridRowsUpdated}
                enableCellSelect={true}
              />
            : `Loading...`
          }
        </div>
      </Fragment>
    )
  }
}

const mapStateToProps = state => {
  return {
    tab: state.project.tab,
    rows: state.project.rows,
  };
};


export default connect(
  mapStateToProps
)(Project);