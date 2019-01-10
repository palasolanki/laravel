import { SET_TABLE, SET_PROJECTS, SET_PROJECT, SET_REDIRECT, SET_PROJECTS_DATA, SET_TAB, SET_PROJECT_TITLE, SET_PROJECT_ROWS } from "../actions/project";

const initialState = {
    rows: [],
    tab: null,
    list: [],
    redirect: false,
    tabId: null,
    tabs: [],
    columns: []
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
        case SET_PROJECTS_DATA:
            return {...state, ...action.payload.data, tabId: action.payload.tabId};
        case SET_TAB:
            return {...state, tabs: [...state.tabs, action.payload]};
        case SET_PROJECT_TITLE:
            return {...state, title: action.payload };
        case SET_PROJECT_ROWS:
            return {...state, rows: action.payload };
        default:
            return state;
    }
}

export default project;