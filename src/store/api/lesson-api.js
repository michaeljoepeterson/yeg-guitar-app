import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/dist/query/react";
import { API_BASE_URL } from "../../config";
import buildQuery from "../../utils/build-query";

const keepUnusedDataFor = 60;

export const lessonApi = createApi({
    reducerPath: 'lessonApi',
    baseQuery: fetchBaseQuery({
        baseUrl: `${API_BASE_URL}/lessons`
    }),
    tagTypes:['Put', 'Delete', 'Create Lesson'],
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
            keepUnusedDataFor,
            providesTags: ['Put', 'Create Lesson', 'Delete']
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
            }),
            invalidatesTags: ['Create Lesson']
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
            keepUnusedDataFor,
            providesTags: ['Put', 'Create Lesson', 'Delete'],
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
            }),
            invalidatesTags: ['Put']
        }),
        searchLessons: builder.query({
            query: ({authToken, options}) => {
                let {startDate,endDate} = options;
                //todo fix this weird logic
                let filters = {...options};
                if(startDate && endDate){
                    startDate.setHours(23,59);
                    endDate.setHours(0,0,0,0);
                    let startString = startDate.toISOString();
                    let endString = endDate.toISOString();
                    filters.startDate = startString;
                    filters.endDate = endString;
                }
                const query = buildQuery(filters,['selectedDate']);
                return {
                    url: `/search${query}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            },
            transformResponse: (res) => res ? res.lessons : null,
            keepUnusedDataFor,
            providesTags: ['Put', 'Delete', 'Create Lesson']
        }),
        getLessonSummary: builder.query({
            query: ({authToken, id, startDate, endDate}) => {
                startDate.setHours(23,59);
                endDate.setHours(0,0,0,0);
                let startString = startDate.toISOString();
                let endString = endDate.toISOString();
                const query = buildQuery({id,startDate:startString,endDate:endString});
                return {
                    url: `/summary/${query}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                }
            },
            providesTags: ['Put', 'Delete', 'Create Lesson'],
            transformResponse: (res) => res.lessonData
        }),
        deleteLesson: builder.mutation({
            query: ({authToken, id, level}) => ({
                url: `/${id}?userLevel=${level}`,
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            }),
            invalidatesTags: ['Delete']
        }),
        getStudentLastLesson: builder.query({
            query: ({authToken, level, startDate, endDate}) => {
                const start = new Date(startDate).toISOString();
                const end = new Date(endDate).toISOString();

                return {
                    url: `/student-last-lesson?userLevel=${level}&startDate=${start}&endDate${endDate}`,
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${authToken}`
                    }
                };
            },
            //todo move to separate var for easier updating across get methods
            providesTags: ['Put', 'Delete', 'Create Lesson'],
        })
    })
});

export const {
    useGetStudentLessonsQuery,
    useLazyGetStudentLessonsQuery,
    useCreateLessonMutation,
    useLazyGetLessonQuery,
    useUpdateLessonMutation,
    useSearchLessonsQuery,
    useLazySearchLessonsQuery,
    useLazyGetLessonSummaryQuery,
    useDeleteLessonMutation,
    useLazyGetStudentLastLessonQuery
} = lessonApi;