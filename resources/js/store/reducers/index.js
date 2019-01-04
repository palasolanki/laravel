import { combineReducers } from 'redux';
import project from './project';
import selectedProject from './selected-project';
export default combineReducers({project, selectedProject});