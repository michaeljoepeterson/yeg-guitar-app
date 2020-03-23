import {normalizeResponseErrors} from './utils';
import {API_BASE_URL} from '../config';
import {saveAuthToken} from '../local-storage';
import jwtDecode from 'jwt-decode';
//handle loading state
export const AUTH_REQUEST = 'AUTH_REQUEST';
export const authRequest = () => ({
    type:AUTH_REQUEST
});

export const AUTH_SUCCESS = 'AUTH_SUCCESS';
export const authSuccess = (currentUser,token) => ({
    type:AUTH_SUCCESS,
    currentUser,
    token
});

export const AUTH_ERROR = 'AUTH_ERROR';
export const authError = (error) => ({
    type:AUTH_ERROR,
    error
});
//losgout actions
export const LOGOUT = "LOGOUT";
export const logoutSession = () => ({
    type:LOGOUT
});

const storeAuthInfo = (authToken, dispatch) => {
    const decodedToken = jwtDecode(authToken);
    dispatch(authSuccess(decodedToken.user,authToken));
    saveAuthToken(authToken);
}

export const login = (email,password) => dispatch => {
    dispatch(authRequest());
    return (
        fetch(`${API_BASE_URL}/auth/login`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json'
            },
            body:JSON.stringify({
                email,
                password
            })
        })
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((jsonRes) => {
            storeAuthInfo(jsonRes.authToken,dispatch)
        })
        .catch(err => {
            console.log('error logging in',err);
            dispatch(authError(err));
        })
    );
};