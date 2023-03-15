import React, {useEffect,useState} from 'react';
import {getStudentsAsync} from '../actions/studentActions';
import {getUsersAsync,getUserSuccess} from '../actions/userActions';

/**
 * @deprecated
 * @param {*} authToken 
 * @param {*} students 
 * @returns 
 */
export const useGetStudents =  (authToken,students) => {
    const [allStudents,setStudents] = useState([]);

    useEffect(() => {
        async function getStudents(authToken){
            try{
                //console.log('getting students======');
                let students = await getStudentsAsync(authToken);
                setStudents(students);
            }
            catch(e){
                console.warn('error getting students',e);
                setStudents(null)
            }
        }

        getStudents(authToken);

    },[students]);

    return allStudents;
}

/**
 * @deprecated
 * @param {*} authToken 
 * @param {*} dispatch 
 * @returns 
 */
export const useGetTeachers =  (authToken,dispatch) => {
    const [allTeachers,setTeachers] = useState([]);

    useEffect(() => {
        async function getTeachers(authToken){
            try{
                //console.log('getting teacherss======');
                let teachers = await getUsersAsync(authToken);
                if(dispatch){
                    await dispatch(getUserSuccess(teachers));
                }
                setTeachers(teachers);
            }
            catch(e){
                console.warn('error getting teachers',e);
                setTeachers(null)
            }
        }

        getTeachers(authToken);

    },[]);

    return allTeachers;
}
