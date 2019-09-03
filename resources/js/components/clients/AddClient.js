import React, { useState } from 'react';

class AddClient extends React.Component {
    render() {
        return (
        <div className="bg-white">
                    <h2>Add Client</h2>
                    <form className="form-horizontal" action="/action_page.php">
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="email">Name:</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="client_name" placeholder="Enter Name" name="client_name" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="company_name">Company Name:</label>
                            <div className="col-sm-10">
                                <input type="text" className="form-control" id="company_name" placeholder="Enter Company Name" name="company_name" />
                            </div>
                        </div>
                        <div className="form-group">
                            <label className="control-label col-sm-2" htmlFor="country">Country:</label>
                            <div className="col-sm-10">
                                <select className="form-control" name="country" value="">
                                    <option value="" disabled>Country</option>
                                    <option value="India">India</option>
                                    <option value="USA">USA</option>
                                    <option value="Canada">Canada</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <div className="col-sm-offset-2 col-sm-10">
                                <button type="submit" className="btn btn--prime">Add</button>
                            </div>
                        </div>
                    </form>
        </div>);
                }
            }
            
export default AddClient