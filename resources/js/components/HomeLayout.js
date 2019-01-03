import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";
import classNames from 'classnames';

import Header from "./header/Header";
import Dashboard from "./dashboard/Dashboard";
import Sidebar from "./sidebar/Sidebar";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: true
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
        <Header toggleSidebar={this.toggleSidebar} />
        <Sidebar isSidebarOpen={isSidebarOpen} />
        <div className={classNames({ "full": !isSidebarOpen }, "main")}>
        <Switch>
            <Route exact path={match.url}  component={Dashboard}/>
         </Switch>
        </div>
      </Fragment>
    )
  }
}
