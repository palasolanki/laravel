import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import HomeLayout from "./HomeLayout";
import ProjectLayout from "./ProjectLayout";

export default class App extends Component {
    render() {
        return (
            <BrowserRouter>
                <Switch>
                    <Route
                        path="/project"
                        component={ProjectLayout}
                    />
                    <Route path="/"  component={HomeLayout}/>
                </Switch>
            </BrowserRouter>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(<App />, document.getElementById('app'));
}
