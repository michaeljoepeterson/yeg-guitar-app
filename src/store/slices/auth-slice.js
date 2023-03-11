import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/auth-api";
import jwtDecode from 'jwt-decode';

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
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
            const authToken = action.payload;
            const decodedToken = jwtDecode(authToken);
            state.authToken = authToken;
            state.currentUser = decodedToken.user;
            state.loading = false;
            console.log('refreshed slice', state, action);
        })
        .addMatcher(authApi.endpoints.refreshToken.matchPending, (state, action) => {
            state.loading = true;
            console.log('refreshed slice', state, action);
        })
        .addMatcher(authApi.endpoints.refreshToken.matchRejected, (state, action) => {
            state.loading = false;
            console.log('refreshed slice', state, action);
        })
    }
});
