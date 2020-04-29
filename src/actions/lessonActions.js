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

export const GET_LESSON_ERROR = 'GET_LESSON_ERROR';
export const getLessonError = (error) => ({
    type:GET_LESSON_ERROR,
    error
});

export const saveLesson = (lesson) => (dispatch,getState) => {
    dispatch(addLessonRequest());
    const authToken = loadAuthToken();
    //console.log(JSON.stringify(lesson));
    let promise = new Promise((resolve,reject) => {
        return (
            fetch(`${API_BASE_URL}/lessons`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body:JSON.stringify(lesson)
            })
    
            .then(res => normalizeResponseErrors(res))
            .then(res => res.json())
            .then((jsonRes) => {
                dispatch(addLessonSuccess(jsonRes));
                resolve(jsonRes);
            })
            .catch(err => {
                console.log('error saving lesson ',err);
                dispatch(addLessonError(err));
                reject(err);
            })
        );
    });
    
    return promise;
}

export const getLessons = () => (dispatch,getState) => {
    dispatch(getLessonRequest());
    const authToken = loadAuthToken();
    return (
        fetch(`${API_BASE_URL}/lessons`,{
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