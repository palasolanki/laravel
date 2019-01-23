import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import HomeLayout from "./HomeLayout";
import ProjectLayout from "./ProjectLayout";
import Login from "./login/Login";
import { Provider } from 'react-redux'
import store from '../store/store.js';
import { library } from '@fortawesome/fontawesome-svg-core'
import { fab } from '@fortawesome/free-brands-svg-icons'
import { faBars, faEllipsisV } from '@fortawesome/free-solid-svg-icons'

library.add(fab, faBars, faEllipsisV);

export default class App extends Component {
    render() {
        return (
            <div className="wrapper">
                <Switch>
                    <Route
                        path="/project"
                        component={ProjectLayout}
                    />
                    <Route exact path="/" component={HomeLayout} />
                    <Route path="/login" component={Login} />
                </Switch>
            </div>
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
