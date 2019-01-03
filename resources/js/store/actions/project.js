import api from '../../helpers/api';
export const SET_TABLE = "PROJECT | SET_TABLE";

export function setTable(payload) {
    return { type: SET_TABLE, payload };
}

export function getProjects()
{
    return (dispatch) => {
        return api.get('/projects')
        .then((res) => {
            console.log(res.data);
        })
        .catch((res) => {

        })
    }
}