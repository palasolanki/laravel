import React, { Component, Fragment } from 'react';
import ReactDataGrid from 'react-data-grid';

const columns = [
    { key: "id", name: "ID", editable: true },
    { key: "title", name: "Title", editable: true },
    { key: "complete", name: "Complete", editable: true }
];

export default class Project extends Component {
    constructor(props) {
        super(props);
        this.state = {
            rows:  [
                { id: 0, title: "Task 1", complete: 20 },
                { id: 1, title: "Task 2", complete: 40 },
                { id: 2, title: "Task 3", complete: 60 }
            ]
        }

        this.onGridRowsUpdated = this.onGridRowsUpdated.bind(this);
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
    return (
      <Fragment>
            <div className="mt-5">
                <ReactDataGrid
                    columns={columns}
                    rowGetter={i => this.state.rows[i]}
                    rowsCount={3}
                    onGridRowsUpdated={this.onGridRowsUpdated}
                    enableCellSelect={true}
                />
            </div>
      </Fragment>
    )
  }
}
