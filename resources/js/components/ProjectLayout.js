import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";

import ProjectHeader from "./project-header/ProjectHeader";
import TabHeader from "./tab-header/TabHeader";
import Project from "./project/Project";
import Sidebar from "./sidebar/Sidebar";

export default class ProjectLayout extends Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <ProjectHeader toggleSidebar={this.toggleSidebar} />
        <Sidebar />
        <div className="main">
          <TabHeader />
          <Switch>
              <Route exact path={match.url}  component={Project}/>
          </Switch>
         </div>
      </Fragment>
    )
  }
}
