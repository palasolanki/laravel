import { SET_TABLE } from "../actions/project";

const initialState = {
    rows: [],
    tab: null
};

function project(state = initialState, action) {
    switch (action.type) {
        case SET_TABLE:
            return {...state, ...action.payload};
        default:
            return state;
    }
}

export default project;