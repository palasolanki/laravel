import { SET_TABLE, SET_PROJECTS, SET_PROJECT, SET_REDIRECT } from "../actions/project";

const initialState = {
    rows: [],
    tab: null,
    list: [],
    redirect: false
};

function project(state = initialState, action) {
    switch (action.type) {
        case SET_TABLE:
            return {...state, ...action.payload};
        case SET_PROJECTS:
            return {...state, list : action.payload};
        case SET_PROJECT:
            return {...state, list : [...state.list, action.payload]};
        case SET_REDIRECT:
            return {...state, redirect: action.payload};
        default:
            return state;
    }
}

export default project;