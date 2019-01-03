import React, { Component } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import logo from '../../../images/favicon.png';
export default class Header extends Component {

  render() {
    const { toggleSidebar } = this.props;
    return (
      <header className="header d-flex align-items-center">
        <img className="logo rounded-circle" src={logo} alt="Logo"/>
        <div className="ml-4" onClick={toggleSidebar}>
          <FontAwesomeIcon className="bars" icon="bars" />
        </div>
       </header>
    )
  }
}
