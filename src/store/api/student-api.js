import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 120;

export const studentApi = createApi({
    reducerPath: 'studentApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/students`
    }),
    tagTypes:['Put'],
    endpoints: (builder) => ({
        getStudents: builder.query({
            query: ({authToken}) => {
                return {
                    url: '',
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.students : [],
            keepUnusedDataFor,
            providesTags: ['Put']
        }),
        updateStudent: builder.mutation({
            query: ({authToken, student, level}) => {
                let payloadStudent = {...student};
                payloadStudent.category = payloadStudent.category.map(cat => {
                    return cat.id
                });
                return { 
                    url: `/${student.id}?userLevel=${level}`,
                    method:'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body:JSON.stringify({student: payloadStudent})
                }
            },
            invalidatesTags: ['Put']
        })
    })
});

export const {
    useGetStudentsQuery,
    useUpdateStudentMutation
} = studentApi;