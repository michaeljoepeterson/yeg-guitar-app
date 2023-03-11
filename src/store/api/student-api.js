import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 1200;

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/students`
    }),
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: (token) => {
                return {
                    url: '',
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.students : [],
            keepUnusedDataFor
        }),
    })
});

export const {
    useGetStudentsQuery
} = studentApi;