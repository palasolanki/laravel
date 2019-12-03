import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.navTitles = [
      { title: 'Dashboard', url: '/' },
      // { title: 'Projects', url: '/project' },
      { title: 'Clients', url: '/clients' },
      { title: 'Tags', url: '/tags' },
      { title: 'Income', url: '/incomes' },
      { title: 'Expense', url: '/expenses' },
      { title: 'Hardware', url: '/hardwares' },
    ];

    this.state = {
      activeNav: null
    }

    this.activeNav = this.activeNav.bind(this);
  }

  componentDidMount() {
    this.setState({
      activeNav: this.props.match.path
    })
  }

  activeNav(url) {
    this.setState({
      activeNav: url
    })
  }


  render() {
    const { activeNav } = this.state;
    const { isSidebarOpen } = this.props;

    return (
      <div className={classNames({ 'open': isSidebarOpen }, "sidebar")}>
        <ul className="nav flex-column">
          {
            this.navTitles.map((navTitle, i) => {
              return <li className="nav-item" key={i}>
                <Link
                  to={`${navTitle.url}`}
                  className={classNames({ "active": (activeNav === navTitle.url) }, "nav-link")}
                  onClick={() => this.activeNav(navTitle.url)}
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
