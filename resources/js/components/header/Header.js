import React, { Component } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import logo from "../../../images/favicon.png";
import { connect } from "react-redux";
import { logout } from "../../store/actions/auth";
import { setActiveNav } from "../../store/actions/auth";

import {
    faUserCircle,
    faSignOutAlt,
    faUser
} from "@fortawesome/free-solid-svg-icons";

export class Header extends Component {
    constructor(props) {
        super(props);
        this.logout = this.logout.bind(this);
    }

    logout(e) {
        e.preventDefault();
        this.props.logout();
    }

    render() {
        const { toggleSidebar } = this.props;
        return (
            <header className="header d-flex align-items-center justify-content-between py-0">
                <div className="flex-row d-flex align-items-center">
                    <Link
                        to={"/"}
                        onClick={() => {
                            this.props.setActiveNav("/");
                        }}
                    >
                        <img
                            className="logo rounded-circle"
                            src={logo}
                            alt="Logo"
                        />
                    </Link>
                    <div
                        className="ml-md-4 ml-3 hamburger d-flex"
                        onClick={toggleSidebar}
                    >
                        <FontAwesomeIcon className="bars" icon="bars" />
                    </div>
                </div>
                <div className="mr-3 h-100 logout">
                    <div className="logout__link h-100">
                        <div
                            style={{ display: "flex", alignItems: "center" }}
                            className="text-white"
                        >
                            <FontAwesomeIcon size="2x" icon={faUserCircle} />
                            <span className="ml-2">{this.props.name}</span>
                        </div>
                        <ul className="logout__dropdown pl-0 list-unstyled px-3 mb-0">
                            <li>
                                <Link
                                    to={"/profile"}
                                    onClick={() => this.props.setActiveNav("")}
                                >
                                    <FontAwesomeIcon size="1x" icon={faUser} />
                                    <span className="ml-2">Account</span>
                                </Link>
                            </li>
                            <li>
                                <a
                                    href="/"
                                    className="logout"
                                    onClick={this.logout}
                                >
                                    <FontAwesomeIcon
                                        size="1x"
                                        icon={faSignOutAlt}
                                    />
                                    <span className="ml-2">Logout</span>
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </header>
        );
    }
}

const mapStateToProps = state => {
    return {
        activeNav: state.activeNav,
        name: state.auth.user.name
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setActiveNav: url => dispatch(setActiveNav(url)),
        logout: () => dispatch(logout())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Header);
