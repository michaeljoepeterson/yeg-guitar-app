import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";

const keepUnusedDataFor = 120;

export const categoriesApi = createApi({
    reducerPath: 'categoriesApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/category`
    }),
    endpoints: (builder) => ({
        getCategories: builder.query({
            query: ({authToken}) => {
                return {
                    url: ``,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    } 
                }
            },
            transformResponse: (res) => res ? res.categories : [],
            keepUnusedDataFor
        }),
    })
});

export const {
    useGetCategoriesQuery
} = categoriesApi;
