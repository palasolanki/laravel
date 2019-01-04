import api from '../../helpers/api';
export const SET_PROJECT = "SELECTED PROJECT | SET_PROJECT";


export function setProject(payload) {
    return { type: SET_PROJECT, payload };
}

export function getProject(id)
{
    return (dispatch) => {
        return api.get(`/projects/${id}`)
        .then((res) => {
           dispatch(setProject(res.data.data));
        })
        .catch((res) => {

        })
    }
}