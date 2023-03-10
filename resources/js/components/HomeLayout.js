import React, { Component, Fragment } from "react";
import { Switch, Route } from "react-router-dom";
import classNames from "classnames";

import Header from "./header/Header";
import Dashboard from "./dashboard/Dashboard";
import Sidebar from "./sidebar/Sidebar";
import ClientList from "./clients/ClientList";
import Tags from "./tags/Tags";
import Mediums from "./mediums/Mediums";
import Country from "./country/Country";
import Expense from "./expense/Expense";
import Income from "./income/Income";
import AddExpense from "./expense/Add-Expense";
import AddIncome from "./income/Add-Income";
import Client from "./clients/Add-Client";
import EditClient from "./clients/Edit-Client";
import Hardware from "./hardwares/Hardware";
import AddHardware from "./hardwares/Add-Hardware";
import {
    ToastsContainer,
    ToastsStore,
    ToastsContainerPosition
} from "react-toasts";
import Profile from "./profile/Profile";
import Invoices from "./invoices/Invoices";
import AddInvoices from "./invoices/AddInvoices";

export default class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isSidebarOpen: true
        };
        this.toggleSidebar = this.toggleSidebar.bind(this);
        this.checkSidebarMode = this.checkSidebarMode.bind(this);
    }

    componentDidMount() {
        window.addEventListener("resize", this.checkSidebarMode, true);
        this.checkSidebarMode();
    }

    checkSidebarMode() {
        if (window.matchMedia("(max-width: 991px)").matches) {
            this.setState({
                isSidebarOpen: false
            });
        } else {
            this.setState({
                isSidebarOpen: true
            });
        }
    }

    toggleSidebar() {
        this.setState({
            isSidebarOpen: !this.state.isSidebarOpen
        });
    }
    componentWillUnmount() {
        window.removeEventListener("resize", this.checkSidebarMode, true);
    }

    render() {
        const { match } = this.props;
        const { isSidebarOpen } = this.state;
        return (
            <Fragment>
                <Header toggleSidebar={this.toggleSidebar} />
                <Sidebar match={match} isSidebarOpen={isSidebarOpen} />
                <ToastsContainer
                    position={ToastsContainerPosition.TOP_RIGHT}
                    store={ToastsStore}
                />
                <div className={classNames({ full: !isSidebarOpen }, "main")}>
                    <Switch>
                        <Route exact path="/" component={Dashboard} />
                        <Route exact path="/clients" component={ClientList} />
                        <Route exact path="/clients/add" component={Client} />
                        <Route
                            exact
                            path="/editClient/:id"
                            component={EditClient}
                        />
                        <Route exact path="/tags" component={Tags} />
                        <Route exact path="/expenses" component={Expense} />
                        <Route
                            exact
                            path="/expenses/add"
                            component={AddExpense}
                        />
                        <Route exact path="/incomes" component={Income} />
                        <Route
                            exact
                            path="/incomes/add"
                            component={AddIncome}
                        />
                        <Route exact path="/hardwares" component={Hardware} />
                        <Route
                            exact
                            path="/hardwares/add"
                            component={AddHardware}
                        />
                        <Route exact path="/profile" component={Profile} />
                        <Route exact path="/country" component={Country} />
                        <Route exact path="/mediums" component={Mediums} />
                        <Route exact path="/invoices" component={Invoices} />
                        <Route
                            exact
                            path="/invoices/add"
                            component={AddInvoices}
                        />
                        <Route
                            exact
                            path="/invoices/edit/:id"
                            component={AddInvoices}
                        />
                    </Switch>
                </div>
            </Fragment>
        );
    }
}
