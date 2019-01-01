import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import HomeLayout from "./HomeLayout";
import ProjectLayout from "./ProjectLayout";
import { Provider } from 'react-redux'
import store from '../store/store.js';

export default class App extends Component {
    render() {
        return (
                <Switch>
                    <Route
                        path="/project"
                        component={ProjectLayout}
                    />
                    <Route path="/"  component={HomeLayout}/>
                </Switch>
        );
    }
}

if (document.getElementById('app')) {
    ReactDOM.render(
    <Provider store={store}>
    <BrowserRouter>
        <App />
    </BrowserRouter>
    </Provider>, document.getElementById('app'));
}
