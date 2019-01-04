import api from '../../helpers/api';
export const SET_TABLE = "PROJECT | SET_TABLE";
export const SET_PROJECTS = "PROJECT | SET_PROJECTS";

export function setTable(payload) {
    return { type: SET_TABLE, payload };
}


export function setProjects(payload) {
    return { type: SET_PROJECTS, payload };
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