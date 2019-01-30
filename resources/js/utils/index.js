import api from "../helpers/api";

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
