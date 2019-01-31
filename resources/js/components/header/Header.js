import React, { Component } from 'react'
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../images/favicon.png';
import { connect } from 'react-redux';
import { logout } from '../../store/actions/auth';

export class Header extends Component {
  constructor(props) {
    super(props);

    this.logout = this.logout.bind(this);
  }

  logout() {
    this.props.logout();
  }

  render() {
    const { toggleSidebar } = this.props;
    return (
      <header className="header d-flex align-items-center justify-content-between">
        <div className="flex-row d-flex align-items-center">
          <Link to={'/'}>
            <img className="logo rounded-circle" src={logo} alt="Logo" />
          </Link>
          <div className="ml-4 hamburger d-flex" onClick={toggleSidebar}>
            <FontAwesomeIcon className="bars" icon="bars" />
          </div>
        </div>
        <div className="mr-3 text-white font-weight-bold cursor-pointer" onClick={this.logout}>Logout</div>
      </header>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logout: () => dispatch(logout())
  }
}

export default connect(null, mapDispatchToProps)(Header);