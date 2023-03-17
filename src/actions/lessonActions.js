import {normalizeResponseErrors} from './utils';
import {API_BASE_URL} from '../config';
import {loadAuthToken} from '../local-storage';

export const ADD_LESSON_REQUEST = 'ADD_LESSON_REQUEST';
export const addLessonRequest = () => ({
    type:ADD_LESSON_REQUEST
});

export const ADD_LESSON_SUCCESS = 'ADD_LESSON_SUCCESS';
export const addLessonSuccess = () => ({
    type:ADD_LESSON_SUCCESS,
});

export const ADD_LESSON_ERROR = 'ADD_LESSON_ERROR';
export const addLessonError = (error) => ({
    type:ADD_LESSON_ERROR,
    error
});

export const GET_LESSON_REQUEST = 'GET_LESSON_REQUEST';
export const getLessonRequest = () => ({
    type:GET_LESSON_REQUEST
});

export const GET_LESSON_SUCCESS = 'GET_LESSON_SUCCESS';
export const getLessonSuccess = (lessons) => ({
    type:GET_LESSON_SUCCESS,
    lessons
});

export const GET_STUDENT_LESSON_SUCCESS = 'GET_STUDENT_LESSON_SUCCESS';
export const getStudentLessonSuccess = (lessons) => ({
    type:GET_STUDENT_LESSON_SUCCESS,
    lessons
});

export const GET_LESSON_ERROR = 'GET_LESSON_ERROR';
export const getLessonError = (error) => ({
    type:GET_LESSON_ERROR,
    error
});

export const SET_LESSON = 'SET_LESSON';
export const setLesson = (lesson) => ({
    type:SET_LESSON,
    lesson
});

export const GET_LESSON_TYPES_SUCCESS = 'GET_LESSON_TYPES_SUCCESS';
export const getLessonTypesSuccess = (types) => ({
    type:GET_LESSON_TYPES_SUCCESS,
    types
});

export const DELETE_LESSON_SUCCESS = 'DELETE_LESSON_SUCCESS';
export const deleteLessonSuccess = (id) => ({
    type:DELETE_LESSON_SUCCESS,
    id
});


function buildQuery(options,ignoreList){
    let query = '?';
    ignoreList = ignoreList ? ignoreList : [];
    for(let key in options){
        if(options[key] && !ignoreList.includes(key)){
            query += `${key}=${options[key]}&`;
        }   
    }
    query = query.substring(0, query.length - 1);
    return query;
}

function buildDateString(date){
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

export const getMyLessons = (email,startDate,endDate) => (dispatch,getState) => {
    dispatch(getLessonRequest());
    const authToken = getState().auth.authToken;
    let startString = buildDateString(startDate);
    let endString = buildDateString(endDate);
    const query = buildQuery({email,startDate:startString,endDate:endString});

    return (
        fetch(`${API_BASE_URL}/lessons/my-lessons${query}`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        })

        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((lessons) => {
            dispatch(getLessonSuccess(lessons.lessons));
        })
        .catch(err => {
            console.log('error getting lessons ',err);
            dispatch(getLessonError(err));
        })
    );
}

export const setSelectedLesson = (lesson) => (dispatch,getState) => {
    //addFullNames(lesson)
    dispatch(setLesson(lesson));
}


export const generalSearch = (options) => async (dispatch,getState) =>{
    console.log('getting lessons');
    dispatch(getLessonRequest());
    const authToken = getState().auth.authToken;
    let {startDate,endDate} = options;
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
    const url = `${API_BASE_URL}/lessons/search${query}`
    try{
        let res = await fetch(url,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        });
        res = await normalizeResponseErrors(res);
        res = await res.json();
        dispatch(getLessonSuccess(res.lessons));
        return res.lessons
    }
    catch(e){
        console.log('error getting lessons ',e);
        dispatch(getLessonError(e));
    }
}

/**
 * @deprecated
 * @returns
 */
export const getLessonTypes = () => async (dispatch,getState) =>{
    console.log('getting lessons');
    dispatch(getLessonRequest());
    const authToken = getState().auth.authToken;
    const url = `${API_BASE_URL}/lesson-types`
    try{
        let res = await fetch(url,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        });
        res = await normalizeResponseErrors(res);
        res = await res.json();
        dispatch(getLessonTypesSuccess(res.types));
        return res.types
    }
    catch(e){
        console.log('error getting lessons ',e);
        dispatch(getLessonError(e));
    }
}

/**
 * @deprecated
 * @param {*} type 
 * @param {*} level 
 * @returns 
 */
export const createType = (type,level) => async (dispatch,getState) =>{
    try{
        dispatch(addLessonRequest);
        const url = `${API_BASE_URL}/lesson-types?userLevel=${level}`;
        let payload = !type.lessonType ? {
            lessonType:type
        } : type;
        console.log(JSON.stringify(payload));
        const authToken = getState().auth.authToken;
        let res = await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body:JSON.stringify(payload)
        });
        res = await normalizeResponseErrors(res);
        res = await res.json();
        dispatch(addLessonSuccess());
        return res;
    }
    catch(e){
        console.log('error saving type ',e);
        dispatch(addLessonRequest(e));
    }
}

export const deleteLesson = (id,level) => async (dispatch,getState) => {
    try{
        const authToken = getState().auth.authToken;
        const url = `${API_BASE_URL}/lessons/${id}?userLevel=${level}`;
        let res = await fetch(url,{
            method:'DELETE',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        });
        res = await normalizeResponseErrors(res);
        res = await res.json();
        dispatch(deleteLessonSuccess(id));
        return res;
    }
    catch(e){
        console.log('error saving type ',e);
    }
}