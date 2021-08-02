import React, { Component, Fragment, useState } from 'react'
import api from "../../helpers/api";
import { ToastsStore } from "react-toasts";
import { setMe } from '../../store/actions/auth';

function InvoiceMsgModal(props) {
    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        fontSize: '20px',
        cursor: 'pointer'
    };
    const[message,setMessage]=useState('');

    const onChange =  (e) => {
        setMessage(e.target.value);
    }

    return (
        <Fragment>
        <div
            className="modal"
            style={{ display: "block", transition: 'display 1s' }}
        >
            <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div className="modal-content">
                    <div className="modal-header align-items-center">
                        <h3 className="heading mb-0"> Mail Invoice</h3>
                        <div className="gradient_border-2">
                            <span onClick={props.handleCloseEdit} style={closeModalSpanStyle}>X</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label>Message:</label>
                                <textarea className="form-control" name="message" id="medium" placeholder="Enter message" onBlur={onChange}
                             ></textarea>
                            </div>

                            <div className="form-group text-right">
                                <button type="button" className="btn btn--prime mr-1 sendData" onClick={ (e) => props.sendInvoice(e, message)} disabled={props.isLoading}>{(props.isLoading) ? 'Sending..' : 'Send'}</button>
                                <button onClick={props.handleCloseEdit} className="btn btn--cancel ml-1">Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div className="modal-backdrop show" />
        </Fragment>
    )
}

export default InvoiceMsgModal