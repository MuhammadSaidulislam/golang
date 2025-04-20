import { DESKIE_API as API } from '../config';

export const post = (url: string, body: any = {}) => {
    const token = JSON.parse(localStorage.getItem("company") || '{}');
    const { jwt } = token;
    return fetch(`${API}${url}`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (jwt) ? `Bearer ${jwt.toString()}` : "",
        },
        body: JSON.stringify(body),
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
};


// GET request
export const get = (url: string) => {
    const jwt = JSON.parse(localStorage.getItem("company") || '{}');
    const { token } = jwt;
    return fetch(`${API}${url}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (token) ? `Bearer ${token.toString()}` : "",
        }
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
};

// PUT request
export const put = (url: string, body: any = {}) => {
    const jwt = JSON.parse(localStorage.getItem("company") || '{}');
    const { token } = jwt;
    return fetch(`${API}${url}`, {
        method: 'PUT',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (token) ? `Bearer ${token.toString()}` : "",
        },
        body: JSON.stringify(body),
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
};



// PATCH request
export const patch = (url: string, body: any = {}) => {
    const token = JSON.parse(localStorage.getItem("company") || '{}');
    const { jwt } = token;
    return fetch(`${API}${url}`, {
        method: 'PATCH',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (jwt) ? `Bearer ${jwt.toString()}` : "",
        },
        body: JSON.stringify(body),
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
};


// DELETE request
export const del = (url: string, body: any = {}) => {
    const token = JSON.parse(localStorage.getItem("company") || '{}');
    const { jwt } = token;
    return fetch(`${API}${url}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (jwt) ? `Bearer ${jwt.toString()}` : "",
        },
        body: JSON.stringify(body),
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
};

// GET JWT request
export const getJwt = (url: string,token:string) => {

    return fetch(`${API}${url}`, {
        method: 'GET',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: (token) ? `Bearer ${token.toString()}` : "",
        }
    })
        .then((res) => {
            return res.json();
        })
        .catch((err) => {
            return err;
        });
};
