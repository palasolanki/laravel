import React, { Component } from 'react';

export default class Tab extends Component {

  render() {
    const { title, isActive, isContentEditable, onTabClick, onTabDoubleClick, tabRef, onTabBlur } = this.props;

    return <li className="nav-item" ref={tabRef}>
              <div
                className={"nav-link " + ( isActive  ? 'active' : '')}
                onDoubleClick={onTabDoubleClick}
                onClick={onTabClick}
                contentEditable={isContentEditable}
                suppressContentEditableWarning={true}
                onBlur={onTabBlur}
                >
                  {title}
              </div>

          </li>
  }
}