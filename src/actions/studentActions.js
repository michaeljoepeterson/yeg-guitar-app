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

export const CREATE_STUDENT_SUCCESS = 'CREATE_STUDENT_SUCCESS';
export const createStudentSuccess = () => ({
    type:CREATE_STUDENT_SUCCESS
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

export const getStudentsAsync = async (authToken) => {
    try{
        let studentRaw = await fetch(`${API_BASE_URL}/students`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        });
        studentRaw = await normalizeResponseErrors(studentRaw);
        let students = await studentRaw.json();
        return students.students;
    }
    catch(e){
        console.log('error getting students ',e);
    }
};

export const createStudent = (student,level) => (dispatch,getState) => {
    dispatch(studentRequest());
    const authToken = getState().auth.authToken;
    let promise = new Promise((resolve,reject) => {
        return (
            fetch(`${API_BASE_URL}/students?level=${level}`,{
                method:'POST',
                headers:{
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${authToken}`
                },
                body:JSON.stringify(student)
            })
    
            .then(res => normalizeResponseErrors(res))
            .then(res => res.json())
            .then((response) => {
                dispatch(createStudentSuccess());
                resolve(response)
            })
            .catch(err => {
                console.log('error saving student ',err);
                dispatch(studentError(err));
            })
        );
    });
    

    return promise;
};

export const updateStudentAsync = async (student,level) => {
    let authToken = loadAuthToken();
    try{
        let payloadStudent = {...student};
        payloadStudent.category = payloadStudent.category.map(cat => {
            return cat.id
        });
        let payload = {
            student:payloadStudent
        };

        let studentRaw = await fetch(`${API_BASE_URL}/students/${student.id}?userLevel=${level}`,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                Authorization: `Bearer ${authToken}`
            },
            body:JSON.stringify(payload)
        });
        studentRaw = await normalizeResponseErrors(studentRaw);
        let response = await studentRaw.json();
        return response;
    }
    catch(e){
        console.log('error updating student ',e);
    }
}