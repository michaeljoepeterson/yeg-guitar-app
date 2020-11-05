import React, {useEffect,useState} from 'react';
import {getStudentsAsync} from '../actions/studentActions';
import {getUsersAsync} from '../actions/userActions';

export const useGetStudents =  (authToken,students) => {
    const [allStudents,setStudents] = useState([]);

    useEffect(() => {
        async function getStudents(authToken){
            try{
                console.log('getting students======');
                let students = await getStudentsAsync(authToken);
                setStudents(students);
            }
            catch(e){
                console.log('error getting students',e);
                setStudents(null)
            }
        }

        getStudents(authToken);

    },[students]);

    return allStudents;
}

export const useGetTeachers =  (authToken) => {
    const [allTeachers,setTeachers] = useState([]);

    useEffect(() => {
        async function getTeachers(authToken){
            try{
                console.log('getting teacherss======');
                let teachers = await getUsersAsync(authToken);
                setTeachers(teachers);
            }
            catch(e){
                console.log('error getting teachers',e);
                setTeachers(null)
            }
        }

        getTeachers(authToken);

    },[]);

    return allTeachers;
}
