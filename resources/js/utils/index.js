import api from "../helpers/api";
import store from "../store/store";
import { setLogout } from "../store/actions/auth";

export function setAuthorizationToken(token) {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }
  else {
    delete api.defaults.headers.common['Authorization'];
  }
}

export function getFormattedErrors(errors) {
  const formattedErrors = {
    message: errors.message,
    fields: {}
  }

  for (let prop in errors.errors) {
    formattedErrors.fields[prop] = errors.errors[prop][0];
  }

  return formattedErrors;

}

export function setAxiosInterceptor() {

  api.interceptors.response.use(
    response => response,
    error => {
      if (error.response.status === 401) {
        store.dispatch(setLogout());
      }
      return Promise.reject(error);
    }
  );
}

