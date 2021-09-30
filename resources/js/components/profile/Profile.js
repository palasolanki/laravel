import React, { useState, Fragment, useEffect } from "react";
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";
import { connect } from "react-redux";
import { setMe } from "../../store/actions/auth";
import { errorResponse } from "../../helpers";

function Profile(props) {
    const [errors, setErrors] = useState([]);
    const [name, setName] = useState(props.name);
    const [email, setEmail] = useState(props.email);
    const [changePassword, setChangePassword] = useState(false);
    const [password, setPassword] = useState("");

    const onSaveHandler = e => {
        let userDetails = {
            name,
            email
        };
        if (changePassword) {
            userDetails = { ...userDetails, password };
        }

        api.post("/profile", userDetails)
            .then(res => {
                ToastsStore.success("Saved.");
                setMe(res, props.dispatch);
            })
            .catch(res => {
                errorResponse(res, setErrors);
            });
    };

    return (
        <Fragment>
            <div className="bg-white p-3">
                <h2 className="heading mb-3">Profile</h2>
                {errors.length > 0 && (
                    <div
                        className="alert alert-danger alert-dismissible fade show pb-0"
                        role="alert"
                    >
                        {errors.map((value, key) => (
                            <p key={key}>{value}</p>
                        ))}
                        <button
                            type="button"
                            className="close"
                            data-dismiss="alert"
                            aria-label="Close"
                            onClick={() => setErrors([])}
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                )}
                {
                    <Fragment>
                        <div className="row mx-0 mb-2">
                            <div className="col-md-3 form-group px-0 pr-md-3">
                                <label htmlFor="name">Name</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="name"
                                    id="name"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="col-md-3 form-group px-0 pr-md-3">
                                <label htmlFor="email">Email</label>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    id="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                        </div>
                        <div className="row mx-0">
                            <div className="col-md-3 form-group px-0 pr-md-3 mb-0">
                                <label htmlFor="change_password">
                                    Change Password
                                </label>
                                <input
                                    type="checkbox"
                                    className="form-check-input"
                                    name="change_password"
                                    id="change_password"
                                    onChange={e => {
                                        setChangePassword(e.target.checked);
                                    }}
                                />
                            </div>
                        </div>
                        <div className="row mx-0 mb-2">
                            {changePassword && (
                                <div className="col-md-3 form-group px-0 pr-md-3">
                                    <label htmlFor="password">Password</label>
                                    <input
                                        type="password"
                                        className="form-control disabled"
                                        name="password"
                                        id="password"
                                        onChange={e =>
                                            setPassword(e.target.value)
                                        }
                                    />
                                </div>
                            )}
                        </div>
                        <div className="row mx-0 mb-2">
                            <div className="col-md-3 form-group px-0 pr-md-3">
                                <button
                                    className="btn btn--prime"
                                    onClick={onSaveHandler}
                                >
                                    Save
                                </button>
                            </div>
                        </div>
                    </Fragment>
                }
            </div>
        </Fragment>
    );
}

const mapStateToProps = state => {
    return {
        name: state.auth.user.name,
        email: state.auth.user.email
    };
};

const mapDispatchToProps = dispatch => {
    return {
        dispatch: dispatch
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);
