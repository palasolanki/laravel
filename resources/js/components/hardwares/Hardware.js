import React, { Component, Fragment, useState, useEffect } from 'react'
import { Link } from "react-router-dom";
import api from '../../helpers/api';
import {ToastsStore} from 'react-toasts';
import EditHardwares from "./Edit-Hardware";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faPlus
} from '@fortawesome/free-solid-svg-icons';

function Hardware() {
    const [hardwares, setHardwares] = useState([]);
    const [types, setTypes] = useState([]);
    const status = {
      'in_use': 'In-Use',
      'spare': 'Spare',
      'needs_repair': 'Needs-Repair'
    };
    const [showEditModal, setEditShow] = useState(false);
    const openShowEdit = () => setEditShow(true);
    const handleCloseEdit = () => setEditShow(false);

    const [showDeleteModal, setDeleteShow] = useState(false);
    const openShowDelete = () => setDeleteShow(true);
    const handleCloseDelete = () => setDeleteShow(false);

    useEffect( () => {
      api.get('/hardwares')
          .then((res) => {
            setHardwares(res.data);
          })
          .catch((res) => {
        }),
        api.get('/getHardwareType')
        .then((res) => {
            setTypes(res.data.type);
        })
    }, [] );
    const [currentHardware, setCurrentHardware] = useState()
    const editRow = hardware => {
        setCurrentHardware(hardware)
        openShowEdit();
    }
    const createdateString = (selectedDate) => {
        let day = selectedDate.getDate();
        let month = selectedDate.getMonth() + 1;
        let year = selectedDate.getFullYear();
        return day+"/"+month+"/"+year;
    }
    const changeDateFormat = (updatedHardware) => {
        const newData = updatedHardware.map((value, key) => {
            if(value['date']) {
                let newDate = createdateString(value['date']);
                return {
                    ...value,
                    date: newDate
                }
            }
            return value;
        });
        return newData;
    }
    const updateHardware = (hardwareId, updatedHardware) => {
        api.patch(`/hardwares/${hardwareId}`, {data:changeDateFormat(updatedHardware)})
        .then((res) => {
            setHardwares(hardwares.map(hardware => (hardware._id === hardwareId ? res.data.updateHardware : hardware)))
            ToastsStore.success(res.data.message);
            handleCloseEdit();
        })
    }

    const [deleteHardwareId, setDeleteHardwareId] = useState();
    const setDeleteHardwareIdFunction = currentDeleteHardwareId =>{
        setDeleteHardwareId(currentDeleteHardwareId);
        openShowDelete();
    }

    const deleteHardware = hardwareId => {
        api.delete(`/hardwares/${hardwareId}`)
        .then((res) => {
            setHardwares(hardwares.filter(hardware => hardware._id !== hardwareId))
            handleCloseDelete();
            ToastsStore.error(res.data.message);
        })
    }

    return  (
                <div className="bg-white p-3">
                    <div className="d-flex align-items-center pb-2">
                        <h2 className="heading">Hardwares</h2>
                <Link to="hardwares/add" className="btn btn--prime ml-auto"><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Hardwares</Link>
                    </div>
                    {/* <h2>Hardwares</h2>
                    <Link
                        style= {{ margin: '10px 10px' }}
                        to="hardwares/add"
                        className="btn btn-info btn-lg">
                        Add Hardware
                    </Link> */}
                    <table className="table">
                        <thead className="thead-light">
                            <tr>
                                <th>Date of Purchase</th>
                                <th>Item</th>
                                <th>Type</th>
                                <th>Serial Number</th>
                                <th>Status</th>
                                <th>Notes</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                        {hardwares.length > 0 ? (
                          hardwares.map(hardware => (
                                <tr key={hardware._id}>
                                    <td>{(hardware.date) ? hardware.date : 'Not available'}</td>
                                    <td>{hardware.item}</td>
                                    <td>{types[hardware.type]}</td>
                                    <td>{(hardware.serial_number)? hardware.serial_number: 'Not available'}</td>
                                    <td>{status[hardware.status]}</td>
                                    <td>{hardware.notes}</td>
                                    <td>
                                        <button className="btn btn-sm btn--prime" onClick={() => editRow(hardware)}>Edit</button>&nbsp;
                                        <button className="btn btn-sm btn--cancel" onClick={() => setDeleteHardwareIdFunction(hardware._id)}>Delete</button>
                                    </td>
                                </tr>
                          ))
                        ) : (
                                <tr>
                                  <td colSpan={3}>No Hardwares</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                     {showEditModal && <EditHardwares handleCloseEdit={handleCloseEdit} currentHardware={currentHardware} types={types} updateHardware={updateHardware} />}
                     {showDeleteModal &&
                         <div>
                           <div style={{ display: 'block' }} className="modal">
                             <div className="modal-dialog register-modal-dialog">
                               <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                                   <div style={{textAlign: 'center',}}>
                                       <h3>Are you sure to delete this Hardware?</h3>
                                   </div>
                                   <div style={{textAlign: 'center',}} className="modal-body">
                                         <button style={{color: '#fff',}} className="btn btn-info" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                                         <button className="btn btn-danger" onClick={() => deleteHardware(deleteHardwareId)}>Delete</button>
                                   </div>
                               </div>
                             </div>
                           </div>
                           <div className="modal-backdrop show" />
                         </div>
                     }

                </div>
            )
}
export default Hardware;
