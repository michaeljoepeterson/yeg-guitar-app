import { createSlice } from "@reduxjs/toolkit";

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
    }
});
