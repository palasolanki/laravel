import React, { Component } from 'react';
import logo from '../../../images/favicon.png';

export default class Login extends Component {
  render() {
    return <div className="page__login d-flex justify-content-center align-items-center">
      <div className="block__login d-flex flex-md-row flex-column">
        <div className="side--left d-flex flex-column justify-content-center align-items-center">
          <img className="login-logo ml-0 rounded-circle" src={logo} alt="Logo" />
          <div className="name text-white mt-2">Expense Tracker</div>
        </div>
        <div className="side--right">
          <h3>Login</h3>
          <form action="">
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" className="form-control" id="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className="form-control border-danger" id="password" />
            </div>
            <button type="button" className="btn btn-login w-100 mt-3">Login</button>
          </form>
        </div>
      </div>
    </div>
  }
}