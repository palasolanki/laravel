import React from 'react'

export default function ConfirmationComponent(props) {
    const { title, handleCloseDelete, action, btnName, confirmBtnColor} = props;
    return (
        <div>
            <div style={{ display: 'block' }} className="modal">
                <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                    <div style={{textAlign: 'center',}}>
                        <h3 className="heading">{title}</h3>
                    </div>
                    <div style={{textAlign: 'center',}} className="modal-body">
                        <button style={{color: '#fff',}} className="btn btn--prime mr-1" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                        <button className={`btn ${confirmBtnColor || "btn--cancel"} ml-1`} onClick={action}>{btnName}</button>
                    </div>
                </div>
                </div>
            </div>
            <div className="modal-backdrop show" />
        </div>
    )
}
