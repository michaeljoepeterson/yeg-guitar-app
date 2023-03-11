import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 1200;

export const lessonTypesApi = createApi({
    reducerPath: 'lessonTypesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/lesson-types`
    }),
    endpoints: (builder) => ({
        getLessonTypes: builder.query({
            query: (token) => {
                return {
                    url: '',
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.types : [],
            keepUnusedDataFor
        }),
    })
});

export const {
    useGetLessonTypesQuery
} = lessonTypesApi;