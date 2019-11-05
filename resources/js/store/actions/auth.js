import api from '../../helpers/api';
import { setAuthorizationToken, getFormattedErrors } from '../../utils';
import jwt_decode from 'jwt-decode';

export const SET_CURRENT_USER = "ADMIN | SET_CURRENT_USER";
export const SET_ERROR = "ADMIN | SET_ERROR";
export const LOGOUT = "ADMIN | LOGOUT";

export function login(data) {
  return (dispatch) => {
    return api.post('/login', data)
      .then((res) => {
        console.log(res)
        const token = res.data.access_token;
        localStorage.setItem('token', token);
        setAuthorizationToken(token);
        dispatch(setCurrentUser(jwt_decode(token)));
      })
      .catch((err) => {
        dispatch(setErrors(getFormattedErrors(err.response.data)));
      })
  }
}

export function setErrors(error) {
  return {
    type: SET_ERROR, errors: error
  }
}

export function setCurrentUser(user) {
  return {
    type: SET_CURRENT_USER, user: { name: user.name, email: user.email, id: user.sub }
  }
}

export function logout() {
  return (dispatch) => {
    return api.post('/logout')
      .then((res) => {
        dispatch(setLogout());
      })
      .catch((res) => {
      })
  }
}

export function setLogout() {
  localStorage.removeItem('token');
  setAuthorizationToken(false);
  return { type: LOGOUT }
}