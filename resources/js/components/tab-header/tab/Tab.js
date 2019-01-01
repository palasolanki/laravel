import React, { Component } from 'react';

export default class Tab extends Component {

  render() {
    const { title, isActive, onTabClick } = this.props;
    return <li className="nav-item">
              <div className={"nav-link " + ( isActive  ? 'active' : '')} onClick={onTabClick}>{title}</div>
          </li>
  }
}