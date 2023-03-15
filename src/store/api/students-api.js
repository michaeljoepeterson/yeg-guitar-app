import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 120;

export const studentssApi = createApi({
    reducerPath: 'studentssApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/students`
    }),
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: ({authToken}) => {
                return {
                    url: ``,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
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
} = studentssApi;
