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
            query: ({authToken, id}) => {
                return {
                    url: `/search-student?id=${id}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.lessons : [],
            keepUnusedDataFor
        }),
        createLesson: builder.mutation({
            query: ({authToken, lesson}) => ({
                url:'',
                method: 'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body:JSON.stringify(lesson)
            })
        }),
        getLesson: builder.query({
            query: ({authToken, id}) => {
                return {
                    url: `/${id}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.lesson : null,
            keepUnusedDataFor
        }),
        updateLesson: builder.mutation({
            query: ({authToken, lesson}) => ({
                url:`/${lesson.id}`,
                method: 'PUT',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body:JSON.stringify(lesson)
            })
        }),
    })
});

export const {
    useGetStudentLessonsQuery,
    useLazyGetStudentLessonsQuery,
    useCreateLessonMutation,
    useLazyGetLessonQuery,
    useUpdateLessonMutation
} = lessonApi;