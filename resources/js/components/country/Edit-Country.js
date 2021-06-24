import React, { Fragment, useState } from 'react'
import {ToastsStore} from 'react-toasts';

function EditCountry(props) {

    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        fontSize: '20px',
        cursor: 'pointer'
      };

    const [country, setCountry] = useState(props.currentCountry)
    const handleInputChange = event => {
        setCountry({
            ...country,
            'name': event.target.value
        })
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
                        <h3 className="heading mb-0">Edit Country</h3>
                        <div className="gradient_border-2">
                            <span onClick={props.handleCloseEdit} style={closeModalSpanStyle}>X</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <form
                            onSubmit={event => {
                                event.preventDefault()
                                if (!country.name) {
                                    ToastsStore.error('Country Field is required');
                                    return
                                }
                                props.updateCountry(country._id, country)
                            }}
                        >
                            <div className="form-group">
                                <label>Country Name:</label>
                                <input type="text" className="form-control" placeholder="Enter Country" value={country.name} onChange={handleInputChange} />
                            </div>
                            <div className="form-group text-right">
                                <button type="submit" className="btn btn--prime mr-1">Submit</button>
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

export default EditCountry