import React, { Component, Fragment } from 'react'
import { Switch, Route, withRouter } from "react-router-dom";
import classNames from 'classnames';
import ProjectHeader from "./project-header/ProjectHeader";
import TabHeader from "./tab-header/TabHeader";
import Project from "./project/Project";
import Sidebar from "./sidebar/Sidebar";

export class ProjectLayout extends Component {
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
    });
    setTimeout(() => {
      window.dispatchEvent(new Event('resize'));
    }, 350);
  }

  render() {
    const { match, history } = this.props;
    const { isSidebarOpen } = this.state;

    return (
      <Fragment>
        <ProjectHeader toggleSidebar={this.toggleSidebar} />
        <Sidebar match={match} isSidebarOpen={isSidebarOpen}/>
        <div className={classNames({ "full": !isSidebarOpen }, "main")}>
          <TabHeader history={history}/>
          <Switch>
              <Route exact path={`${match.url}/:id` } component={Project}/>
          </Switch>
         </div>
      </Fragment>
    )
  }
}

export default withRouter(ProjectLayout);