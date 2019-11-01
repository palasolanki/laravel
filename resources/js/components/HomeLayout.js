import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";
import classNames from 'classnames';

import Header from "./header/Header";
import Dashboard from "./dashboard/Dashboard";
import Sidebar from "./sidebar/Sidebar";
import ClientList from "./clients/ClientList";
import Tags from "./tags/Tags";
import Expense from "./expense/Expense";
import AddExpense from "./expense/Add-Expense";

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSidebarOpen: true
    }
    this.toggleSidebar = this.toggleSidebar.bind(this);
    this.checkSidebarMode = this.checkSidebarMode.bind(this);
  }

  componentDidMount() {
    window.addEventListener('resize', this.checkSidebarMode, true);
    this.checkSidebarMode();
  }

  checkSidebarMode() {
    if (window.matchMedia("(max-width: 991px)").matches) {
      this.setState({
        isSidebarOpen: false
      })
    }
    else {
      this.setState({
        isSidebarOpen: true
      })
    }
  }

  toggleSidebar() {
    this.setState({
      isSidebarOpen: !this.state.isSidebarOpen
    })
  }
  componentWillUnmount() {
    window.removeEventListener('resize', this.checkSidebarMode, true);
  }

  render() {
    const { match } = this.props;
    const { isSidebarOpen } = this.state;
    return (
      <Fragment>
        <Header toggleSidebar={this.toggleSidebar} />
        <Sidebar match={match} isSidebarOpen={isSidebarOpen} />
        <div className={classNames({ "full": !isSidebarOpen }, "main")}>
          <Switch>
            <Route exact path='/' component={Dashboard} />
            <Route exact path='/clients'  component={ClientList} />
            <Route exact path='/tags'  component={Tags} />
            <Route exact path='/expenses'  component={Expense} />
            <Route exact path='/expenses/add'  component={AddExpense} />
          </Switch>
        </div>
      </Fragment>
    )
  }
}
