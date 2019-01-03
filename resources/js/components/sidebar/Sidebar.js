import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.navTitles = [
      {title: 'Dashboard', url: 'dashboard'},
      {title: 'Projects', url: 'project'},
    ];

    this.state = {
      activeNav: 0
    }

    this.activeNav = this.activeNav.bind(this);
  }

  activeNav(navIndex) {
    this.setState({
      activeNav: navIndex
    })
  }


  render() {
    const { activeNav } = this.state;
    const { isSidebarOpen } = this.props;

    return (
      <div className={classNames({'open': isSidebarOpen}, "sidebar")}>
        <ul className="nav flex-column">
        {
          this.navTitles.map((navTitle, i) => {
            return <li className="nav-item" key={i}>
              <Link
                to={`${navTitle.url}`}
                className={classNames({"active": (activeNav === i)}, "nav-link")}
                onClick={() => this.activeNav(i)}
              >
                {navTitle.title}
              </Link>
            </li>
          })
        }
        </ul>
      </div>
    )
  }
}
