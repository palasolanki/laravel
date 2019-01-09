import api from '../../helpers/api';
export const SET_TABLE = "PROJECT | SET_TABLE";
export const SET_PROJECTS = "PROJECT | SET_PROJECTS";
export const SET_PROJECT = "PROJECT | SET_PROJECT";
export const SET_REDIRECT = "PROJECT | SET_REDIRECT";
export const SET_PROJECTS_DATA = "PROJECT | SET_PROJECTS_DATA";
export const SET_TAB = "PROJECT | SET_TAB";
export const SET_PROJECT_TITLE = "PROJECT | SET_TAB";

export function setTable(payload) {
    return { type: SET_TABLE, payload };
}

export function setProjects(payload) {
  return { type: SET_PROJECTS, payload };
}
export function setProjectData(payload) {
  return { type: SET_PROJECTS_DATA, payload };
}
export function setRedirect(payload) {
  return { type: SET_REDIRECT, payload };
}
export function setTab(payload, projectId) {
    return (dispatch) => {
        return api.post(`/tab/${projectId}`, payload)
        .then((res) => {
            dispatch({type: SET_TAB, payload: res.data.data});
        })
    }
}

export function setProject(payload) {
    return (dispatch) => {
        return api.post('/projects', payload)
        .then((res) => {
            dispatch({type: SET_PROJECT, payload: res.data.data});
            dispatch(setRedirect(true));
        })
    }
}

export function setProjectTitle(payload, projectId) {
    return (dispatch) => {
        return api.put(`/projects/${projectId}`, payload)
        .then((res) => {

        })
    }
}

export function getProjects()
{
    return (dispatch) => {
        return api.get('/projects')
        .then((res) => {
           dispatch(setProjects(res.data.data));
        })
        .catch((res) => {
        })
    }
}

export function getProjectData(tabId)
{
    return (dispatch) => {
        return api.get(`/tab/${tabId}`)
        .then((res) => {
           dispatch(setProjectData({data: res.data.data, tabId: tabId}));
        })
        .catch((res) => {

        })
    }
}
