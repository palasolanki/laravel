import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
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
    faGlobeAmericas,
    faFileInvoiceDollar
} from "@fortawesome/free-solid-svg-icons";
export default class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.navTitles = [
            { brandicon: faHome, title: "Dashboard", url: "/" },
            // { title: 'Projects', url: '/project' },
            { brandicon: faDollarSign, title: "Income", url: "/incomes" },
            { brandicon: faCoins, title: "Expense", url: "/expenses" },
            { brandicon: faUsers, title: "Clients", url: "/clients" },
            { brandicon: faMicrochip, title: "Hardware", url: "/hardwares" },
            { brandicon: faTags, title: "Tags", url: "/tags" },
            { brandicon: faCreditCard, title: "Mediums", url: "/mediums" },
            { brandicon: faGlobeAmericas, title: "Country", url: "/country" },
            {
                brandicon: faFileInvoiceDollar,
                title: "Invoices",
                url: "/invoices"
            }
        ];

        this.state = {
            activeNav: null
        };

        this.activeNav = this.activeNav.bind(this);
    }

    componentDidMount() {
        this.setState({
            activeNav: this.props.match.path
        });
    }

    activeNav(url) {
        this.setState({
            activeNav: url
        });
        if (url !== "/") this.props.onDashboardActive(false);
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.isDashboardActive && this.props.isDashboardActive)
            this.activeNav("/");
    }

    render() {
        const { activeNav } = this.state;
        const { isSidebarOpen } = this.props;
        return (
            <div className={classNames({ open: isSidebarOpen }, "sidebar")}>
                <ul className="nav flex-column">
                    {this.navTitles.map((navTitle, i) => {
                        return (
                            <li className="nav-item" key={i}>
                                {/* {console.log(navTitle.url)} */}
                                <Link
                                    to={`${navTitle.url}`}
                                    className={classNames(
                                        {
                                            active: activeNav === navTitle.url
                                        },
                                        "nav-link"
                                    )}
                                    onClick={() => this.activeNav(navTitle.url)}
                                >
                                    <FontAwesomeIcon
                                        className="mr-2"
                                        icon={navTitle.brandicon}
                                    />
                                    {navTitle.title}
                                </Link>
                            </li>
                        );
                    })}
                </ul>
            </div>
        );
    }
}
