import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";
import { loadAuthToken } from "../../local-storage";

export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/auth`
    }),
    endpoints: (builder) => ({
        refreshToken: builder.query({
            query: () => {
                const token = loadAuthToken();
                return {
                    url: '/refresh',
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`
                    } 
                }
            },
            transformResponse: (res) => res.authToken
        })
    })
});

export const {
    useRefreshTokenQuery,
    useLazyRefreshTokenQuery
} = authApi;