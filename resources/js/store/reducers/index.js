import { combineReducers } from "redux";
import project from "./project";
import auth from "./auth";
import activeNav from "./activeNav";

export default combineReducers({ project, auth, activeNav });
