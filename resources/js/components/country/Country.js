import React, { useState, useEffect } from 'react'
import api from '../../helpers/api';
import AddCountry from "./Add-Country";
import EditCountry from "./Edit-Country";
import {ToastsStore} from 'react-toasts';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import ConfirmationComponent from '../ConfirmationComponent';

function Country() {
  const [showAddModal, setShow] = useState(false);
  const [showEditModal, setEditShow] = useState(false);
  const [showDeleteModal, setDeleteShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseEdit = () => setEditShow(false);
  const handleCloseDelete = () => setDeleteShow(false);

  const openShow = () => setShow(true);
  const openShowEdit = () => setEditShow(true);
  const openShowDelete = () => setDeleteShow(true);

  const [country, setCountry] = useState([]);
    useEffect( () => {
        api.get('/countries').then((res) => {
            setCountry(res.data.country);
        })
    }, [] );

  const addCountry = addcountry => {
    api.post(`/countries`, {'name': addcountry}).then((res) => {
        setCountry([
            ...country,
            res.data.country
        ])
        ToastsStore.success(res.data.message);
        handleClose();
    })
  }

  const [deleteCountryId, setDeleteCountryId] = useState();
  const setDeleteCountryIdFunction = currentDeleteCountryId =>{
    setDeleteCountryId(currentDeleteCountryId);
    openShowDelete();
  }

  const deleteCountry = countryId => {
    api.delete(`/countries/${countryId}`).then((res) => {
        setCountry(country.filter(value => value._id !== countryId))
        ToastsStore.success(res.data.message);
        handleCloseDelete();
    })
  }

  const [currentCountry, setCurrentCountry] = useState()
  const editRow = country => {
    setCurrentCountry(country)
    openShowEdit();
  }

  const updateCountry = (countryId, updatedCountry) => {
    api.patch(`/countries/${countryId}`, updatedCountry).then((res) => {
        setCountry(country.map(value => (value._id === countryId ? updatedCountry : value)))
        ToastsStore.success(res.data.message);
        handleCloseEdit();
    })
  }

    return (
        <div className="bg-white p-3">
          <div className="d-flex align-items-center pb-2">
            <h2 className="heading">Country</h2>
            <button to="/" className="btn btn--prime ml-auto" onClick={openShow}><FontAwesomeIcon className="mr-2" icon={faPlus} />Add Country</button>
          </div>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>Country</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {country.length > 0 ? (
                  country.map((value, index) => (
                        <tr key={index}>
                            <td>{value.name}</td>
                            <td>
                                <button className="btn btn-sm btn--prime" onClick={() => editRow(value)}>Edit</button>&nbsp;
                                <button className="btn btn-sm btn--cancel ml-1" onClick={() => setDeleteCountryIdFunction(value._id)}>Delete</button>
                            </td>
                        </tr>
                  ))
                ) : (
                        <tr>
                          <td colSpan={3}>No Country</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showAddModal && <AddCountry handleClose={handleClose} addCountry={addCountry}/>}
            {showEditModal && <EditCountry
                                handleCloseEdit={handleCloseEdit}
                                currentCountry={currentCountry}
                                updateCountry={updateCountry}
                            />}
            {showDeleteModal && <ConfirmationComponent
                                title="Are you sure to delete this Country?"
                                handleCloseDelete={handleCloseDelete}
                                btnName="Delete"
                                action={() => deleteCountry(deleteCountryId)}
                            />}
        </div>
    )
}

export default Country