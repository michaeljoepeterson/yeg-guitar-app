import { createSlice } from "@reduxjs/toolkit";
import { authApi } from "../api/auth-api";

const initialState = {
    currentUser:null,
    error:null,
    loading:false,
    authToken:null,
    testMode:false
};

export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        authSuccess: (state, action) => {
            state.currentUser = action.currentUser;
            state.authToken = action.token;
        }
    },
    extraReducers: (builder) => {
        builder.addMatcher(authApi.endpoints.refreshToken.matchFulfilled, (state, action) => {
            console.log('refreshed slice', state, action);
        });
    }
});
