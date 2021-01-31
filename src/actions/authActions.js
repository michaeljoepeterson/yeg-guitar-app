import {normalizeResponseErrors} from './utils';
import {API_BASE_URL,setTestUrl} from '../config';
import {saveAuthToken,clearAuthToken,loadAuthToken} from '../local-storage';
import jwtDecode from 'jwt-decode';
import fb from '../fb/firebase';
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
export const logoutSession = () => {
    clearAuthToken();
    return {
        type:LOGOUT
    };
}

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

export const refreshAuthToken = () => async (dispatch,getState) => {
    //dispatch(authRequest());
    try{
        const token = loadAuthToken();
        let res = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`
            } 
        })
        res = await normalizeResponseErrors(res);
        let resJson = await res.json();
        let {authToken} = resJson;
        storeAuthInfo(authToken,dispatch)

    }
    catch(e){
        console.log('error refreshing token: ',e);
        dispatch(authError(e));   
    }
};

export const enableTestMode = () => (dispatch) =>{
    setTestUrl();
    dispatch(testEnable());
}

export const googleSignIn = () => async (dispatch) => {
    try{
        const userData = await fb.signInWithGoogle();
        const token = await fb.getToken();
        //console.log('google auth data: ',userData);
        let res = await fetch(`${API_BASE_URL}/auth/login`,{
            method:'POST',
            headers:{
                authtoken:token
            }
        });
        res = await normalizeResponseErrors(res);
        let resJson = await res.json();
        let {authToken} = resJson;
        debugger;
        storeAuthInfo(authToken,dispatch)
    }
    catch(e){
        console.log('error logging in with google: ',e);
        dispatch(authError(e));
    }
}

export const emailSignIn = (email,pass) => async (dispatch) => {
    try{
        const userData = await fb.signInEmail(email,pass);
        const token = await fb.getToken();
        //console.log('google auth data: ',userData);
        let res = await fetch(`${API_BASE_URL}/auth/login`,{
            method:'POST',
            headers:{
                authtoken:token
            }
        });
        res = await normalizeResponseErrors(res);
        let resJson = await res.json();
        let {authToken} = resJson;
        storeAuthInfo(authToken,dispatch)
    }
    catch(e){
        console.log('error logging in with google: ',e);
        dispatch(authError(e));
    }
}

export const createEmailUser = (email,pass) => async (dispatch) => {
    try{
        const userData = await fb.createUserEmail(email,pass);
        const token = await fb.getToken();
        //console.log('google auth data: ',userData);
        let res = await fetch(`${API_BASE_URL}/auth/login`,{
            method:'POST',
            headers:{
                authtoken:token
            }
        });

        res = await normalizeResponseErrors(res);
        let resJson = await res.json();
        return resJson;
    }
    catch(e){
        console.log('error logging in with google: ',e);
        dispatch(authError(e));
        throw e;
    }
}