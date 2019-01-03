import React, { Component } from 'react';

export default class Tab extends Component {

  render() {
    const { title, isActive, onTabClick, onTabDoubleClick, tabRef, onTabBlur, onTabKeyPress } = this.props;

    return <li className="nav-item" ref={tabRef}>
              <div
                className={"nav-link " + ( isActive  ? 'active' : '')}
                onDoubleClick={onTabDoubleClick}
                onClick={onTabClick}
                onKeyPress={onTabKeyPress}
                onBlur={onTabBlur}
                >
                  {title}
              </div>

          </li>
  }
}