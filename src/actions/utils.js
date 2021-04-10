export const normalizeResponseErrors = res => {
    if (!res.ok) {
        if (
            res.headers.has('content-type') &&
            res.headers.get('content-type').startsWith('application/json')
        ) { 
            //Deal with errors returned from server
            return res.json().then(err => Promise.reject(err));
        }
        //deal with errors not coded on the server side
        return Promise.reject({
            code: res.status,
            message: res.statusText
        });
    }
    return res;
};