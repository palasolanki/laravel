import React, { Component } from 'react';
import { Link } from "react-router-dom";
import classNames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library } from '@fortawesome/fontawesome-svg-core';
// import {
//   faBars,
// } from '@fortawesome/free-solid-svg-icons';
// library.add(faHome);
import {
  faHome,
  faUsers,
  faTags,
  faDollarSign,
  faCoins,
  faMicrochip,
  faCreditCard,
  faGlobeAmericas
 } from '@fortawesome/free-solid-svg-icons';
export default class Sidebar extends Component {
  constructor(props) {
    super(props);
    this.navTitles = [
      { brandicon: faHome, title: 'Dashboard', url: '/' },
      // { title: 'Projects', url: '/project' },
      { brandicon: faDollarSign, title: 'Income', url: '/incomes' },
      { brandicon: faCoins, title: 'Expense', url: '/expenses' },
      { brandicon: faUsers, title: 'Clients', url: '/clients' },
      { brandicon: faMicrochip, title: 'Hardware', url: '/hardwares' },
      { brandicon: faTags, title: 'Tags', url: '/tags' },
      { brandicon: faCreditCard, title: 'Mediums', url: '/mediums' },
      { brandicon: faGlobeAmericas, title: 'Country', url: '/country' },
      { brandicon: faMicrochip, title: 'Invoices', url: '/invoices' },
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
                  <FontAwesomeIcon className="mr-2" icon={navTitle.brandicon} />
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
