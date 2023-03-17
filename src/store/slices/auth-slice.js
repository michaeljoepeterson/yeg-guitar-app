import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/auth-api";
import jwtDecode from 'jwt-decode';
import fb from "../../fb/firebase";
import { clearAuthToken, saveAuthToken } from "../../local-storage";
import { API_BASE_URL } from "../../config";

const initialState = {
    currentUser: null,
    error: null,
    loading: true,
    authToken: null,
    testMode: false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authSuccess: (state, action) => {
            state.currentUser = action.currentUser;
            state.authToken = action.token;
            state.loading = false;
        },
        loginSuccess: (state, action) => {
            const authToken = action.payload;
            const decodedToken = jwtDecode(authToken);
            console.log('login', authToken);
            saveAuthToken(authToken);
            state.authToken = authToken;
            state.currentUser = decodedToken.user;
            state.loading = false;
            state.error = null;
        },
        authError: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },
        logout: (state, action) => {
            clearAuthToken();
            state.loading = false;
            state.error = false;
            state.currentUser = null;
            state.authToken = null;
        }
    },
    extraReducers: (builder) => {
        builder
        .addCase(signInWithGoogle.fulfilled, (state, action) => {
            if(action.payload){
                authSlice.caseReducers.loginSuccess(state, action);
            }
            else{
                authSlice.caseReducers.authError(state, {
                    payload: 'Error logging in please verify access'
                });
            }
        })
        .addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
            authSlice.caseReducers.loginSuccess(state, action);
        })
        .addMatcher(authApi.endpoints.refreshToken.matchPending, (state, action) => {
            state.loading = true;
        })
        .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state, action) => {
            authSlice.caseReducers.authError(state, {
                payload: 'Error logging in'
            });
        })
    }
});

export const signInWithGoogle = createAsyncThunk('googleSignIn', async () => {
    await fb.signInWithGoogle();
    const token = await fb.getToken();
    let res = await fetch(`${API_BASE_URL}/auth/login`,{
        method:'POST',
        headers:{
            authtoken:token
        }
    });
    let resJson = await res.json();
    let {authToken} = resJson;
    return authToken;
});

export const {logout} = authSlice.actions;