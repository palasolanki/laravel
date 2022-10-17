import React from 'react'
import DatePicker from 'react-datepicker';

export default function ConfirmationComponent(props) {
    const { title, handleCloseDelete, action, btnName, confirmBtnColor, isMarkAsPaid=false, handleMarkAsPaid=null, disabled=false, errors=[], markAsPaidData=null} = props;

    return (
        <div>
            <div style={{ display: 'block' }} className="modal">
                <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                    <div style={{textAlign: 'center',}}>
                        <h3 className="heading">{title}</h3>
                    </div>
                    {errors.length > 0 && (
                        <div className="alert alert-danger pb-0">
                            {errors.map((value, key) => (
                                <p key={key}>{value}</p>
                            ))}
                        </div>
                    )}
                    {isMarkAsPaid && (
                        <>
                            <div className="form-group">
                                <label
                                    className="control-label col-auto px-0"
                                    htmlFor="hourly_rate"
                                >
                                    Payment Receive Date:
                                </label>
                                <div className="col-sm-10 pl-0">
                                    <DatePicker
                                        className="form-control"
                                        name="payment_receive_date"
                                        selected={markAsPaidData.payment_receive_date || new Date()}
                                        onChange={handleMarkAsPaid}
                                        dateFormat="dd-MM-yyyy"
                                    />
                                </div>
                            </div>
                            <div className="form-group">
                                <label
                                    className="control-label col-auto px-0"
                                    htmlFor="hourly_rate"
                                >
                                    INR Amount Received:
                                </label>
                                <div className="col-sm-10 pl-0">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder="Enter INR Amount Received"
                                        name="inr_amount_received"
                                        onChange={handleMarkAsPaid}
                                    />
                                </div>
                            </div>
                        </>
                        
                    )}
                    <div style={{textAlign: 'center',}} className="modal-body">
                        <button style={{color: '#fff',}} className="btn btn--prime mr-1" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                        <button className={`btn ${confirmBtnColor || "btn--cancel"} ml-1`} onClick={action} disabled={disabled}>{btnName}</button>
                    </div>
                </div>
                </div>
            </div>
            <div className="modal-backdrop show" />
        </div>
    )
}
