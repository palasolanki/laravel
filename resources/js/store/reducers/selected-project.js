import {  SET_PROJECT } from "../actions/selected-project";

const initialState = {
    info: {},
    tabs: []
};

function selectedProject(state = initialState, action) {
    switch (action.type) {
        case SET_PROJECT:
            return {...state, ...action.payload};
        default:
            return state;
    }
}

export default selectedProject;