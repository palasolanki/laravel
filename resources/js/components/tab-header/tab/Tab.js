import React, { Component } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Tab extends Component {

  render() {
    const { title, isActive, onTabClick, onTabDoubleClick, tabRef, onTabBlur, onTabKeyPress, showDropdown, visibleDropdown, deleteActiveTab, isContentEditable, tabLength } = this.props;
    return <li className="nav-item" ref={tabRef}>
              <div
                className={"nav-link " + ( isActive  ? 'active' : '')}
                onDoubleClick={onTabDoubleClick}
                onClick={onTabClick}
                onKeyPress={onTabKeyPress}
                onBlur={onTabBlur}
                >
                  {title}
                  {
                (isActive && !isContentEditable && (tabLength !== 1)) && <button className="btn ellipsis-h" type="button" onClick={showDropdown}>
                    <FontAwesomeIcon icon="ellipsis-v" />
                    </button>
                  }
              </div>
              {
                (isActive && !isContentEditable && (tabLength !== 1)) &&  <div className="custom-dropdown">
                    <div className={classnames({'show': visibleDropdown}, "dropdown-menu")}>
                      <button className="dropdown-item" type="button">Edit</button>
                      <button className="dropdown-item" type="button" onClick={deleteActiveTab}>Delete</button>
                    </div>
                  </div>
              }
               </li>
  }
}