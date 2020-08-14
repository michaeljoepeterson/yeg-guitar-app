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

export const SET_LESSON = 'SET_LESSON';
export const setLesson = (lesson) => ({
    type:SET_LESSON,
    lesson
});

export const saveLesson = (lesson) => (dispatch,getState) => {
    dispatch(addLessonRequest());
    const authToken = getState().auth.authToken;
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
    const authToken = getState().auth.authToken;
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

function buildQuery(options){
    let query = '?';

    for(let key in options){
        if(options[key]){
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

function addFullNames(lesson){
    for(let i = 0;i < lesson.students.length;i++){
        let student = lesson.students[i];
        student.fullName = student.firstName + ' ' + student.lastName;
        student.id = student._id;
    }
}

export const setSelectedLesson = (lesson) => (dispatch,getState) => {
    //addFullNames(lesson)
    dispatch(setLesson(lesson));
}

export const updateLesson = (lesson) => (dispatch,getState) => {
    dispatch(addLessonRequest());
    const authToken = getState().auth.authToken;
    //console.log(JSON.stringify(lesson));
    let promise = new Promise((resolve,reject) => {
        return (
            fetch(`${API_BASE_URL}/lessons/${lesson.id}`,{
                method:'PUT',
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

export const getLessonSummary = (id,startDate,endDate) => (dispatch,getState) => {
    //dispatch(getLessonRequest());
    const authToken = getState().auth.authToken;
    let startString = buildDateString(startDate);
    let endString = buildDateString(endDate);
    const query = buildQuery({id,startDate:startString,endDate:endString});

    let promise = new Promise((resolve,reject) => {
        fetch(`${API_BASE_URL}/lessons/summary${query}`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        })

        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((lessonData) => {
            //dispatch(getLessonSuccess(lessons.lessons));
            resolve(lessonData);
        })
        .catch(err => {
            console.log('error getting lessons ',err);
            //dispatch(getLessonError(err));
            reject(err);
        })
    });
        
    return promise;
}