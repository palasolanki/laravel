import React, { Component, Fragment } from 'react';
export default class Project extends Component {
  render() {
    return (
      <Fragment>
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-8">
                    <div className="card">
                        <div className="card-header">Example Component</div>

                        <div className="card-body">
                            I'm an example component!
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </Fragment>
    )
  }
}
