import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";
import classNames from 'classnames';

import ProjectHeader from "./project-header/ProjectHeader";
import TabHeader from "./tab-header/TabHeader";
import Project from "./project/Project";
import Sidebar from "./sidebar/Sidebar";

export default class ProjectLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: false
    }

    this.toggleSidebar = this.toggleSidebar.bind(this);
  }

  toggleSidebar() {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen
    })
  }
  render() {
    const { match } = this.props;
    const { isSidebarOpen } = this.state;

    return (
      <Fragment>
        <ProjectHeader toggleSidebar={this.toggleSidebar} />
        <Sidebar isSidebarOpen={isSidebarOpen}/>
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
