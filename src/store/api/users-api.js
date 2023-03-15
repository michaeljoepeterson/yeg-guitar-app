import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 120;

export const usersApi = createApi({
    reducerPath: 'usersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/users`
    }),
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
            keepUnusedDataFor
        }),
    })
});

export const {
    useGetUsersQuery
} = usersApi;
