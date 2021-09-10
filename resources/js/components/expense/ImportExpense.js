import React, {useState, Fragment} from 'react';

export default function ImportExpense(props) {
    const closeModalSpanStyle = {
        color: '#000',
        float: 'right',
        fontSize: '20px',
        cursor: 'pointer'
    };
    const [fileState ,setFileState] = useState();

    const onFileChange = (event) =>{
        setFileState({selectedFile:event.target.files[0]});
    }

    return (
        <Fragment>
        <div className="modal" style={{ display: "block", transition: 'display 1s' }} >
            <div className="modal-dialog modal-dialog-centered register-modal-dialog">
                <div className="modal-content">
                    <div className="modal-header align-items-center">
                        <h3 className="heading mb-0">Import an expense file</h3>
                        <div className="gradient_border-2">
                            <span onClick={props.handleCloseImportModal} style={closeModalSpanStyle}>X</span>
                        </div>
                    </div>
                    <div className="modal-body">
                        <form>
                            <div className="form-group">
                                <label>Upload File:</label>
                                <input type="file" onChange={onFileChange}></input>
                            </div>

                            <div className="form-group text-right">
                                <button type="button" className="btn btn--prime mr-1 sendData" onClick={()=>props.importData(fileState)}>Upload</button>
                                <button onClick={props.handleCloseImportModal} className="btn btn--cancel ml-1">Cancel</button>
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
