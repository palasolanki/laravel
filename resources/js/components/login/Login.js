import React, { Component } from 'react';
import classnames from "classnames";
import logo from '../../../images/favicon.png';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';
import { login } from "../../store/actions/auth";

export class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: null,
      password: null
    }

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(e) {
    this.setState({
      [e.target.id]: e.target.value
    })

  }

  handleSubmit(e) {
    e.preventDefault();
    this.props.login(this.state);
  }

  render() {
    const { auth, errors } = this.props;
    if (auth.isAuthenticated) {
      return <Redirect to={'/'} />
    }
    return <div className="page__login d-flex justify-content-center align-items-center">
      <div className="block__login d-flex flex-md-row flex-column">
        <div className="side--left d-flex flex-column justify-content-center align-items-center">
          <img className="login-logo ml-0 rounded-circle" src={logo} alt="Logo" />
          <div className="name text-white mt-2">Expense Tracker</div>
        </div>
        <div className="side--right">
          <h3>Login</h3>
          <form onSubmit={this.handleSubmit}>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="text" className={classnames("form-control")} id="email" onChange={this.handleChange} />
              {
                errors.fields.email && (
                  <span className="text-danger">{errors.fields.email}</span>
                )
              }
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" className={classnames("form-control")} id="password" onChange={this.handleChange} />
              {
                errors.fields.password && (
                  <span className="text-danger">{errors.fields.password}</span>
                )
              }

            </div>
            {

              (errors.message && Object.keys(errors.fields).length === 0) && (
                <span className="text-danger">{errors.message}</span>
              )
            }
            <button className="btn btn-login w-100 mt-3">Login</button>
          </form>
        </div>
      </div>
    </div>
  }
}


const mapStateToProps = state => {
  return {
    auth: state.auth,
    errors: state.auth.errors
  };
};


const mapDispatchToProps = dispatch => {
  return {
    login: (data) => dispatch(login(data))
  };
};


export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
