import { combineReducers } from 'redux';
import project from './project';
import auth from './auth';
export default combineReducers({ project, auth });