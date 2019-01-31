import { SET_CURRENT_USER, SET_ERROR, LOGOUT } from '../actions/auth';
import { isEmpty } from 'lodash';

const initialState = {
  isAuthenticated: false,
  user: {},
  errors: {
    message: null,
    fields: {}
  }
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: !isEmpty(action.user),
        user: action.user
      }
    case SET_ERROR:
      return {
        ...state, errors: action.errors
      }
    case LOGOUT:
      return initialState
    default:
      return state
  }
}

export default authReducer;