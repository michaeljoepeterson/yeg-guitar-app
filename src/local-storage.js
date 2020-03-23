export const loadAuthToken = () => {
    return localStorage.getItem('authToken');
};
//saves jwt to locat storage
export const saveAuthToken = authToken => {
    try {
        localStorage.setItem('authToken', authToken);
    } catch (e) {}
};

export const clearAuthToken = () => {
    try {
        localStorage.removeItem('authToken');
    } catch (e) {}
};