import React, { Component, Fragment } from 'react';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default class Tab extends Component {

  render() {
    const { title, isActive, onTabClick, onTabDoubleClick, tabRef, onTabBlur, onTabKeyPress, showDropdown, visibleDropdown, deleteActiveTab, isContentEditable, tabLength, showConfirmationPopup, confirmDeleteTab, backToDropdown, onEditBtn } = this.props;

    return <li className="nav-item" ref={tabRef}>
      <div
        className={"nav-link " + (isActive ? 'active' : '')}
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
        (isActive && !isContentEditable && (tabLength !== 1)) && <div className="custom-dropdown">
          {

            <div className={classnames({ 'show': visibleDropdown }, "dropdown-menu")}>
              {
                showConfirmationPopup ?
                  <div className="popup">
                    <p className="text-center">Are you sure?</p>
                    <div className="d-flex justify-content-around px-4">
                      <button className="btn btn-sm btn--prime" onClick={deleteActiveTab}>Yes</button>
                      <button className="btn btn-sm btn--cancel" onClick={backToDropdown}>No</button>
                    </div>
                  </div>
                  :
                  <Fragment>
                    <button className="dropdown-item" type="button" onClick={onEditBtn}>Edit</button>
                    <button className="dropdown-item" type="button" onClick={confirmDeleteTab}>Delete</button>
                  </Fragment>
              }

            </div>
          }
        </div>
      }
    </li>
  }
}