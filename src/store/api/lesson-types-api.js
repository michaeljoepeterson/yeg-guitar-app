import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 120;

export const lessonTypesApi = createApi({
    reducerPath: 'lessonTypesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/lesson-types`
    }),
    endpoints: (builder) => ({
        getLessonTypes: builder.query({
            query: ({authToken}) => {
                return {
                    url: '',
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.types : [],
            keepUnusedDataFor
        }),
        createType: builder.mutation({
            query: ({authToken, type, level}) => {
                const payload = !type.lessonType ? {
                    lessonType:type
                } : type;
                return {
                    url: `?userLevel=${level}`,
                    method:'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body: JSON.stringify(payload)
                }
            }
        })
    })
});

export const {
    useGetLessonTypesQuery,
    useCreateTypeMutation
} = lessonTypesApi;