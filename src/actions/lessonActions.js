import {normalizeResponseErrors} from './utils';
import {API_BASE_URL} from '../config';

export const ADD_LESSON_REQUEST = 'ADD_LESSON_REQUEST';
export const addLessonRequest = () => ({
    type:ADD_LESSON_REQUEST
});

export const ADD_LESSON_SUCCESS = 'ADD_LESSON_SUCCESS';
export const authSuccess = () => ({
    type:ADD_LESSON_SUCCESS,
});

export const ADD_LESSON_ERROR = 'ADD_LESSON_ERROR';
export const addLessonError = (error) => ({
    type:ADD_LESSON_ERROR,
    error
});