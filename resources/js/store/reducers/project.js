import { SET_TABLE, SET_PROJECTS } from "../actions/project";

const initialState = {
    rows: [],
    tab: null,
    list: []
};

function project(state = initialState, action) {
    switch (action.type) {
        case SET_TABLE:
            return {...state, ...action.payload};
        case SET_PROJECTS:
            return {...state, list : action.payload};
        default:
            return state;
    }
}

export default project;