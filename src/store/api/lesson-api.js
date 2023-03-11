import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 1200;

export const lessonApi = createApi({
    reducerPath: 'lessonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/lessons`
    }),
    endpoints: (builder) => ({
        getStudentLessons: builder.query({
            query: ({token, id}) => {
                return {
                    url: `/search-student?id=${id}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.lessons : [],
            keepUnusedDataFor
        }),
    })
});

export const {
    useGetStudentLessonsQuery,
    useLazyGetStudentLessonsQuery
} = lessonApi;