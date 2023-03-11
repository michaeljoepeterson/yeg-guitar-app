import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth-api";
import { lessonApi } from "./api/lesson-api";
import { lessonTypesApi } from "./api/lesson-types-api";
import { studentApi } from "./api/student-api";
import { authSlice } from "./slices/auth-slice";

export const rtkStore = configureStore(({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [lessonTypesApi.reducerPath]: lessonTypesApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(authApi.middleware)
    .concat(studentApi.middleware)
    .concat(lessonTypesApi.middleware)
    .concat(lessonApi.middleware)
}));