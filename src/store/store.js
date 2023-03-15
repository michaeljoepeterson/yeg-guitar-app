import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "./api/auth-api";
import { categoriesApi } from "./api/categories-api";
import { lessonApi } from "./api/lesson-api";
import { lessonTypesApi } from "./api/lesson-types-api";
import { studentApi } from "./api/student-api";
import { usersApi } from "./api/users-api";
import { authSlice } from "./slices/auth-slice";

export const rtkStore = configureStore(({
    reducer: {
        [authSlice.name]: authSlice.reducer,
        [authApi.reducerPath]: authApi.reducer,
        [studentApi.reducerPath]: studentApi.reducer,
        [lessonTypesApi.reducerPath]: lessonTypesApi.reducer,
        [lessonApi.reducerPath]: lessonApi.reducer,
        [usersApi.reducerPath]: usersApi.reducer,
        [categoriesApi.reducerPath]: categoriesApi.reducer
    },
    middleware: (getDefaultMiddleware) => getDefaultMiddleware({
        // required due to passing options filter object in get lessons api
        // ideally refactor to not pass that data 
        serializableCheck: false
    })
    .concat(authApi.middleware)
    .concat(studentApi.middleware)
    .concat(lessonTypesApi.middleware)
    .concat(lessonApi.middleware)
    .concat(usersApi.middleware)
    .concat(categoriesApi.middleware)
}));