import {normalizeResponseErrors} from './utils';
import {API_BASE_URL} from '../config';

export const GET_STUDENT_REQUEST = 'GET_STUDENT_REQUEST';
export const getStudentRequest = () => ({
    type:GET_STUDENT_REQUEST
});

export const GET_STUDENT_SUCCESS = 'GET_STUDENT_SUCCESS';
export const getStudentSuccess = (students) => ({
    type:GET_STUDENT_SUCCESS,
    students
});

export const GET_STUDENT_ERROR = 'GET_STUDENT_ERROR';
export const getStudentError = (error) => ({
    type:GET_STUDENT_ERROR,
    error
});

export const getStudents = () => (dispatch,getState) => {
    dispatch(getStudentRequest());
    const authToken = getState().auth.authToken;
    return (
        fetch(`${API_BASE_URL}/students`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        })

        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((students) => {
            
            dispatch(getStudentSuccess(students.students));
        })
        .catch(err => {
            console.log('error getting students ',err);
            dispatch(getStudentError(err));
        })
    );
};