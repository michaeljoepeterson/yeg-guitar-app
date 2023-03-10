import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth-api";
import { authSlice } from "./slices/auth-slice";

export const rtkStore = configureStore(({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [authApi.name]: authApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(authApi.middleware)
}));