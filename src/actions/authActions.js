import {normalizeResponseErrors} from './utils';
import {API_BASE_URL,setTestUrl} from '../config';
import {saveAuthToken,clearAuthToken,loadAuthToken} from '../local-storage';
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

export const TEST_ENABLE = 'TEST_ENABLE';
export const testEnable = () => ({
    type:TEST_ENABLE
});

const storeAuthInfo = (authToken, dispatch) => {
    const decodedToken = jwtDecode(authToken);
    dispatch(authSuccess(decodedToken.user,authToken));
    saveAuthToken(authToken);
}

export const login = (email,password) => (dispatch,getState) => {
    const testMode = getState().auth.testMode;
    if(testMode){     
        console.log('is test mode');
        setTestUrl();
        dispatch(enableTestMode())
    }
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

export const refreshAuthToken = () => (dispatch,getState) => {
    //dispatch(authRequest());
    const authToken = loadAuthToken();
    //debugger;
    return fetch(`${API_BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${authToken}`
        }
    })
    .then(res => normalizeResponseErrors(res))
    .then(res => res.json())
    .then(({authToken}) => {
        //debugger;
        //storeAuthInfo(authToken, dispatch)
        console.log('auth token updated: ',authToken);
        storeAuthInfo(authToken,dispatch)
    })
    .catch(err => {
        dispatch(authError(err));
        clearAuthToken(authToken);
    });
};

export const enableTestMode = () => (dispatch) =>{
    setTestUrl();
    dispatch(testEnable());
}