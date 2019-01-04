import React, { Component, Fragment } from 'react';
import {connect} from 'react-redux';
import {getProjects} from '../../store/actions/project';
import project from '../../store/reducers/project';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.types = [
      {title: 'Expense', projects: [
        {title: 'Project 1'},
        {title: 'Project 2'},
        {title: 'Project 3'}
      ]},
      {title: 'Income', projects: [
        {title: 'Project 1'},
        {title: 'Project 2'},
        {title: 'Project 3'}
      ]}
    ]
    }

  componentDidMount()
  {
    this.props.getProjects();
  }
  render() {

    return (
      <Fragment>
        <div className="dashboard p-3">
            {
              this.types.map((type, i) => {
               return <div className="section" key={i}>
                  <h3 className="mb-5">{type.title}</h3>
                  <div className="list">
                  <ul className="ml-3 list-inline unstyled">
                    {
                      type.projects.map((project, j) => {
                        return <li key={j} className="list-inline-item">
                                <div>{project.title}</div>
                              </li>
                      })
                    }
                    <li className="list-inline-item">
                      <button type="button" className="btn--custom btn btn-prime rounded-circle">+</button>
                    </li>
                  </ul>
                </div>
                </div>
              })
            }

          </div>

      </Fragment>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects())
  }
}

export default connect(null, mapDispatchToProps)(Dashboard);