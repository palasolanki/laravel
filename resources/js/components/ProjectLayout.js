import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";
import classNames from 'classnames';
import { connect } from 'react-redux';
import ProjectHeader from "./project-header/ProjectHeader";
import TabHeader from "./tab-header/TabHeader";
import Project from "./project/Project";
import Sidebar from "./sidebar/Sidebar";
import api from '../helpers/api';
import { getProjectsData, setProjectsData } from "../store/actions/project";

export class ProjectLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false
    }

    this.toggleSidebar = this.toggleSidebar.bind(this);
  }
  componentDidMount() {
    this.props.getProjectsData();
  }

  toggleSidebar() {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350);
  }

  render() {
    const { match } = this.props;
    const { isSidebarOpen } = this.state;

    return (
      <Fragment>
        <ProjectHeader toggleSidebar={this.toggleSidebar} />
        <Sidebar match={match} isSidebarOpen={isSidebarOpen}/>
        <div className={classNames({ "full": !isSidebarOpen }, "main")}>
          <TabHeader />
          <Switch>
              <Route exact path={`${match.url}/:id` }  component={Project}/>
          </Switch>
         </div>
      </Fragment>
    )
  }
}


const mapStateToProps = state => {
  return {
    projectData: state.project.projectData
  };
};

const mapDispatchToProps = dispatch => {
  return {
    getProjectsData: () => dispatch(getProjectsData()),
    setProjectsData: (data) => dispatch(setProjectsData(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProjectLayout);