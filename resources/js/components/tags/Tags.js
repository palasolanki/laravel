import React, { Component, Fragment, useState, useEffect } from 'react'
import api from '../../helpers/api';
// import { Switch, Route } from "react-router-dom";
// import { Link, Route } from "react-router-dom";
// import Modal from 'react-bootstrap-modal';
import AddTags from "./Add-Tags";
import EditTags from "./Edit-Tags";


function Tags() { 
  //For modal open/close
  const [showAddModal, setShow] = useState(false);
  const [showEditModal, setEditShow] = useState(false);
  const [showDeleteModal, setDeleteShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleCloseEdit = () => setEditShow(false);
  const handleCloseDelete = () => setDeleteShow(false);

  const openShow = () => setShow(true);
  const openShowEdit = () => setEditShow(true);
  const openShowDelete = () => setDeleteShow(true);

  //For get tags from server and display list of tags
  const tagsData = [];

  const [tags, setTags] = useState(tagsData);
  useEffect( () => { 
    api.get('/tags')
        .then((res) => {
           setTags(res.data);
        })
        .catch((res) => {
      })
   }, [] );
  
//For add new tag in database
  const addTag = tag => {
     api.post(`/tags`, tag)
     .then((res) => {
        setTags([...tags, res.data.addedTag]);
        handleClose();
     })
  }

  //For delete tag 
  const [deleteTagId, setDeleteTagId] = useState();

  const setDeleteTagIdFunction = currentDeleteTagId =>{
    setDeleteTagId(currentDeleteTagId);
    openShowDelete();
  }
  
  const deleteTag = tagId => {
    api.delete(`/tags/${tagId}`)
      .then((res) => {
        console.log(res.data);
        setTags(tags.filter(tag => tag._id !== tagId)) 
        handleCloseDelete();     
      })
  }

  //For open edit modal with auto filled input field
  const [currentTag, setCurrentTag] = useState()

  const editRow = tag => {
    setCurrentTag(tag)
    openShowEdit();
  }

  //For update data in database and display in list.
  const updateTag = (tagId, updatedTag) => {
    api.patch(`/tags/${tagId}`, updatedTag)
      .then((res) => {
        setTags(tags.map(tag => (tag._id === tagId ? res.data.updatedTag : tag)))   
        handleCloseEdit();   
      })
  }

    return (
        <div className="bg-white">
            <h2>Client</h2>

            <button style={{ margin: '10px 10px' }} type="button" className="btn btn-info btn-lg" onClick={openShow}>Add Tag</button>

            <div className="container">

              <div className="modal fade" id="myModal" role="dialog">
                <div className="modal-dialog">
                
                  <div className="modal-content">
                    <div className="modal-header">
                      <button type="button" className="close" data-dismiss="modal">&times;</button>
                      <h4 className="modal-title">Modal Header</h4>
                    </div>
                    <div className="modal-body">
                      <p>Some text in the modal.</p>
                    </div>
                    <div className="modal-footer">
                      <button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
                    </div>
                  </div>
                    
                </div>
              </div>
                
            </div>
            <table className="table">
                <thead className="thead-light">
                    <tr>
                        <th>Tag</th>
                        <th>Type</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                {tags.length > 0 ? (
                  tags.map(tag => (
                        <tr key={tag._id}>
                            <td>{tag.tag}</td>
                            <td>{tag.type}</td>
                            <td>
                                <button className="btn btn-sm btn--prime" onClick={() => editRow(tag)}>Edit</button>&nbsp;
                                <button className="btn btn-sm btn--cancel" onClick={() => setDeleteTagIdFunction(tag._id)}>Delete</button>
                            </td>
                        </tr>
                  ))
                ) : (
                        <tr>
                          <td colSpan={3}>No Tags</td>
                        </tr>
                    )}
                </tbody>
            </table>

            {showAddModal && <AddTags handleClose={handleClose} addTag={addTag}/>}
            {showEditModal && <EditTags handleCloseEdit={handleCloseEdit} currentTag={currentTag} updateTag={updateTag} />}
            {showDeleteModal &&
                <div>
                  <div style={{ display: 'block' }} className="modal">
                    <div className="modal-dialog register-modal-dialog">
                      <div style={{padding:'25px',}} className="modal-content gradient_border modal-background">
                          <div style={{textAlign: 'center',}}>
                              <h3>Are you sure to delete this tag?</h3>
                          </div>
                          <div style={{textAlign: 'center',}} className="modal-body">
                                <button style={{color: '#fff',}} className="btn btn-info" onClick={handleCloseDelete}>Cancel</button>&nbsp;
                                <button className="btn btn-danger" onClick={() => deleteTag(deleteTagId)}>Delete</button>
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

export default Tags
