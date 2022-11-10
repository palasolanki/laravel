import React from 'react'
import DatePicker from 'react-datepicker';

export default function MarkAsPaidConfirmation(props) {
    const { title, handleCloseDelete, action, btnName, confirmBtnColor, handleMarkAsPaid, disabled, errors, markAsPaidData} = props;

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
                    <div className="mark-as-paid-field mt-3">
                        <div className="form-group">
                            <label
                                className="control-label col-auto px-0"
                                htmlFor="payment_receive_date"
                            >
                                Payment Receive Date:
                            </label>
                            <DatePicker
                                className="form-control"
                                id="payment_receive_date"
                                name="payment_receive_date"
                                selected={markAsPaidData.payment_receive_date === 'undefined' ? new Date() : new Date(markAsPaidData.payment_receive_date)}
                                onChange={handleMarkAsPaid}
                                dateFormat="dd-MM-yyyy"
                            />
                        </div>
                        <div className="form-group">
                            <label
                                className="control-label col-auto px-0"
                                htmlFor="inr_amount_received"
                            >
                                INR Amount Received:
                            </label>
                            <input
                                type="text"
                                id="inr_amount_received"
                                className="form-control"
                                placeholder="Enter INR Amount Received"
                                name="inr_amount_received"
                                value={markAsPaidData.inr_amount_received === 'undefined' ? 0 : markAsPaidData.inr_amount_received}
                                onChange={handleMarkAsPaid}
                            />
                        </div>
                        <div >
                            <input
                                type="checkbox"
                                id="add_as_income"
                                name="add_as_income"
                                className='w-auto h-auto mr-2'
                                checked={markAsPaidData.add_as_income}
                                onChange={handleMarkAsPaid}
                            />
                            <label
                                className="control-label col-auto px-0"
                                htmlFor="add_as_income"
                            >
                                Add As Income
                            </label>
                        </div>
                    </div>
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
