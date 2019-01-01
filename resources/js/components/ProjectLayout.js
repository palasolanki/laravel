import React, { Component, Fragment } from 'react'
import { Switch, Route } from "react-router-dom";

import Header from "./headers/Header";
import TabHeader from "./headers/TabHeader";
import Project from "./project/Project";

export default class ProjectLayout extends Component {
  render() {
    const { match } = this.props;
    return (
      <Fragment>
        <Header />
        <TabHeader />
        <Switch>
            <Route exact path={match.url}  component={Project}/>
         </Switch>
      </Fragment>
    )
  }
}
