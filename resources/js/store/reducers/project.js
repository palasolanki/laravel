import {
    SET_TABLE, SET_PROJECTS, SET_PROJECT, SET_REDIRECT, SET_PROJECTS_DATA, SET_TAB, SET_PROJECT_TITLE, RESET_TAB, SET_NEW_TAB_ADDED, SET_PROJECT_ROWS,
    SET_TAB_TITLE,
    RESET_PROJECT
} from "../actions/project";

const initialState = {
    rows: [],
    tab: null,
    list: [],
    redirect: false,
    tabId: null,
    tabs: [],
    columns: [],
    newTabAdded: false,
    tabDeleted: false
};

function project(state = initialState, action) {
    switch (action.type) {
        case SET_TABLE:
            return { ...state, ...action.payload };
        case SET_PROJECTS:
            return { ...state, list: action.payload };
        case SET_PROJECT:
            return { ...state, list: [...state.list, action.payload] };
        case SET_REDIRECT:
            return { ...state, redirect: action.payload };
        case SET_PROJECTS_DATA:
            return { ...state, ...action.payload.data, tabId: action.payload.tabId };
        case SET_TAB:
            return { ...state, tabs: [...state.tabs, action.payload] };
        case SET_PROJECT_TITLE:
            return { ...state, title: action.payload };
        case SET_PROJECT_ROWS:
            return { ...state, rows: action.payload };
        case RESET_TAB:
            return { ...state, tabDeleted: action.payload };
        case SET_NEW_TAB_ADDED:
            return { ...state, newTabAdded: action.payload };
        case RESET_PROJECT:
            return initialState;
        case SET_TAB_TITLE:
            return {
                ...state, tabs: state.tabs.map(item => {
                    if (item._id === action.payload.tabId) {
                        return { ...item, ...action.payload }
                    }
                    return item
                })
            };
        default:
            return state;
    }
}

export default project;