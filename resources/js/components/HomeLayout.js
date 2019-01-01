import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";

import Header from "./header/Header";
import Dashboard from "./dashboard/Dashboard";

export default class Home extends Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Header />
        <Switch>
            <Route exact path={match.url}  component={Dashboard}/>
         </Switch>
      </Fragment>
    )
  }
}
