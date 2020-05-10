import {normalizeResponseErrors} from './utils';
import {API_BASE_URL} from '../config';
import {loadAuthToken} from '../local-storage';
//use this as generic student request
export const STUDENT_REQUEST = 'STUDENT_REQUEST';
export const studentRequest = () => ({
    type:STUDENT_REQUEST
});

export const GET_STUDENT_SUCCESS = 'GET_STUDENT_SUCCESS';
export const getStudentSuccess = (students) => ({
    type:GET_STUDENT_SUCCESS,
    students
});
//use this as generic student error
export const STUDENT_ERROR = 'STUDENT_ERROR';
export const studentError = (error) => ({
    type:STUDENT_ERROR,
    error
});


export const getStudents = () => (dispatch,getState) => {
    dispatch(studentRequest());
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
            dispatch(studentError(err));
        })
    );
};

export const createStudent = (student) => (dispatch,getState) => {
    dispatch(studentRequest());
    const authToken = getState().auth.authToken;

    return (
        fetch(`${API_BASE_URL}/students`,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body:JSON.stringify(student)
        })

        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((students) => {
            
            dispatch(getStudentSuccess(students.students));
        })
        .catch(err => {
            console.log('error getting students ',err);
            dispatch(studentError(err));
        })
    );
};