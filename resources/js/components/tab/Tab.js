import React, { Component } from 'react';

export default class Tab extends Component {

  render() {
    const {onTabClick, isActive} = this.props;
    return (<li className="nav-item">
      <div className={(isActive) ? 'nav-link active' : 'nav-link'}  onClick={onTabClick}>{this.props.title}</div>
    </li>
    )
  }
}