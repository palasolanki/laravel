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
import { setAuthorizationToken, setAxiosInterceptor } from '../utils';
import { setCurrentUser } from '../store/actions/auth';
import jwt_decode from 'jwt-decode';
import requireAuth from '../utils/requireAuth'


library.add(fab, faBars, faEllipsisV);

export default class App extends Component {
    render() {
        return (
            <div className="wrapper">
                <Switch>
                    <Route
                        path="/project"
                        component={requireAuth(ProjectLayout)}
                    />
                    <Route exact path="/" component={requireAuth(HomeLayout)} />
                    <Route path="/login" component={Login} />
                </Switch>
            </div>
        );
    }
}

if (localStorage.token) {
    setAuthorizationToken(localStorage.token);
    store.dispatch(setCurrentUser(jwt_decode(localStorage.token)));
}

setAxiosInterceptor();

if (document.getElementById('app')) {
    ReactDOM.render(
        <Provider store={store}>
            <BrowserRouter>
                <App />
            </BrowserRouter>
        </Provider>, document.getElementById('app'));
}
