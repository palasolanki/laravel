import api from '../../helpers/api';
export const SET_TABLE = "PROJECT | SET_TABLE";
export const SET_PROJECTS = "PROJECT | SET_PROJECTS";
export const SET_PROJECT = "PROJECT | SET_PROJECT";
export const SET_REDIRECT = "PROJECT | SET_REDIRECT";
export const SET_PROJECTS_DATA = "PROJECT | SET_PROJECTS_DATA";
export const SET_TAB = "PROJECT | SET_TAB";
export const SET_PROJECT_TITLE = "PROJECT | SET_PROJECT_TITLE";
export const RESET_TAB = "PROJECT | RESET_TAB";
export const SET_PROJECT_ROWS = "PROJECT | SET_ROWS";
export const SET_NEW_TAB_ADDED = "PROJECT | SET_NEW_TAB_ADDED";
export const SET_TAB_TITLE = "PROJECT | SET_TAB_TITLE";
export const RESET_PROJECT = "PROJECT | RESET_PROJECT";

export function setTable(payload) {
    return (dispatch) => {
        dispatch({ type: SET_TABLE, payload });
        if (payload.rows) {
            dispatch(setInitialRows(payload.rows));
        }
    }
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

export function setRows(payload) {
    return { type: SET_PROJECT_ROWS, payload };
}

export function setTab(payload, projectId) {
    return (dispatch) => {
        return api.post(`/tab/${projectId}`, payload)
            .then((res) => {
                dispatch({ type: SET_TAB, payload: res.data.data });
                dispatch(setInitialRows(res.data.data.rows))
                dispatch(setTabAdded(true));
            })
    }
}

export function setTabAdded(payload) {
    return { type: SET_NEW_TAB_ADDED, payload }
}

export function setProject(payload) {
    return (dispatch) => {
        return api.post('/projects', payload)
            .then((res) => {
                dispatch({ type: SET_PROJECT, payload: res.data.data });
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

export function getProjects() {
    return (dispatch) => {
        return api.get('/projects')
            .then((res) => {
                dispatch(setProjects(res.data.data));
            })
            .catch((res) => {
            })
    }
}

export function getProjectData(tabId) {
    return (dispatch) => {
        return api.get(`/tab/${tabId}`)
            .then((res) => {
                dispatch(setProjectData({ data: res.data.data, tabId: tabId }));
                dispatch(setInitialRows(res.data.rows));
            })
            .catch((res) => {

            })
    }
}

export function setInitialRows(rows) {
    rows = rows || [];

    if (rows.length === 0) {
        rows.push({ id: 1 });
        rows.push({ id: '+' });
    }

    return setRows(rows);
}


export function updateTabRows(tabId, rows) {
    return api.patch(`/tab/${tabId}`, { rows })
        .then((res) => {
            console.log('updated successfully');
        })
}
export function deleteTab(activeTabId) {
    return (dispatch, getState) => {
        return api.delete(`/tab/${activeTabId}`)
            .then((res) => {
                let tabs = getState().project.tabs;
                tabs = tabs.filter((tab) => {
                    return tab._id !== activeTabId;
                })
                dispatch(setTable({ tabs }));
                dispatch(setDeletedTab(true));
            })
    }
}

export function setDeletedTab(payload) {
    return { type: RESET_TAB, payload }
}

export function deleteProject(projectId) {
    return (dispatch, getState) => {
        return api.delete(`/projects/${projectId}`)
            .then((res) => {
                let list = getState().project.list;
                list = list.filter((list) => {
                    return list._id !== projectId;
                })
                dispatch(setTable({ list }));
            })
    }
}
export function setDeletedList(payload) {

    return { type: RESET_LIST, payload }
}

export function setTabTitle(payload, tabId) {
    return (dispatch) => {
        return api.patch(`/tab/${tabId}`, payload)
            .then((res) => {
                payload.tabId = tabId;
                dispatch({ type: SET_TAB_TITLE, payload })
            })
    }
}

export function resetProject(payload) {
    return { type: RESET_PROJECT, payload }
}