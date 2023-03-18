import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 120;

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/users`
    }),
    tagTypes: ['Put'],
    endpoints: (builder) => ({
        getUsers: builder.query({
            query: ({authToken}) => {
                return {
                    url: ``,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.users : [],
            keepUnusedDataFor,
            providesTags: ['Put']
        }),
        updateUser: builder.mutation({
            query: ({authToken, user, level}) => {
                let payload = {
                    user
                };
                return {
                    url: `/create?userLevel=${level}`,
                    method:'POST',
                    headers:{
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${authToken}`
                    },
                    body:JSON.stringify(payload)
                }
            },
            invalidatesTags: ['Put']
        })
    })
});

export const {
    useGetUsersQuery,
    useUpdateUserMutation
} = usersApi;
