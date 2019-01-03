import React, { Component } from 'react';
import {connect} from 'react-redux';
import {getProjects} from '../../store/actions/project';

class Dashboard extends Component {
  componentDidMount()
  {
    this.props.getProjects();
  }
  render() {
    return (
      <div>This is Dashboard</div>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    getProjects: () => dispatch(getProjects())
  }
}

export default connect(null, mapDispatchToProps)(Dashboard);