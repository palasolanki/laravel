import React, { Component } from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { setActiveNav } from "../../store/actions/activeNav";
import { connect } from "react-redux";

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
class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.navTitles = [
            { brandicon: faHome, title: "Dashboard", url: "/" },
            { brandicon: faDollarSign, title: "Income", url: "/incomes" },
            { brandicon: faCoins, title: "Expenses", url: "/expenses" },
            { brandicon: faUsers, title: "Clients", url: "/clients" },
            { brandicon: faMicrochip, title: "Hardwares", url: "/hardwares" },
            { brandicon: faTags, title: "Tags", url: "/tags" },
            { brandicon: faCreditCard, title: "Mediums", url: "/mediums" },
            { brandicon: faGlobeAmericas, title: "Country", url: "/country" },
            {
                brandicon: faFileInvoiceDollar,
                title: "Invoices",
                url: "/invoices"
            }
        ];
    }

    componentDidMount() {
        this.props.setActiveNav("/" + window.location.pathname.split("/")[1]);
    }

    render() {
        const { isSidebarOpen } = this.props;
        return (
            <div className={classNames({ open: isSidebarOpen }, "sidebar")}>
                <ul className="nav flex-column">
                    {this.navTitles.map((navTitle, i) => {
                        return (
                            <li className="nav-item" key={i}>
                                <Link
                                    to={`${navTitle.url}`}
                                    className={classNames(
                                        {
                                            active:
                                                this.props.activeNav ===
                                                navTitle.url
                                        },
                                        "nav-link"
                                    )}
                                    onClick={() => {
                                        this.props.setActiveNav(navTitle.url);
                                    }}
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

const mapStateToProps = props => {
    return {
        activeNav: props.activeNav
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setActiveNav: url => dispatch(setActiveNav(url))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sidebar);
