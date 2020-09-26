import React, { useState, useEffect  } from 'react';
import {generalSearch} from '../../actions/lessonActions';
import {getStudentsAsync} from '../../actions/studentActions';
import {getUsersAsync} from '../../actions/userActions';
import {connect} from 'react-redux';
import DatePicker from './date-picker';
import Grid from '@material-ui/core/Grid';
import './styles/filter-controls.css';

function FilterControls(props){
    const startDateType = 'startDate';
    const endDateType = 'endDate';
 
    const setInitialDates = () => {
        let startDate = !props.startDate ? new Date() : new Date(props.startDate);
        startDate.setDate(startDate.getDate() + 1);
        let endDate = !props.endDate ? new Date(startDate) : new Date(props.endDate);
        endDate.setDate(endDate.getDate() + 1);
        const defaultRange = 30;
        endDate.setDate(endDate.getDate() - defaultRange);
        let dates = [startDate,endDate];

        return dates
    }

    const dateUpdated = (event, dateField) => {
        let newDate = new Date(event);
        console.log('updating date');
        if(dateField === startDateType){
            setStartDate(newDate);
        }
        else if(dateField === endDateType){
            setEndDate(newDate);
        }
    }

    const searchLessons = async () =>{
        console.log('dispatch lesson search',startDate,endDate);
        console.log(allStudents,allTeachers);
        props.dispatch(generalSearch());
    }

    const dates = setInitialDates();

    const [startDate, setStartDate] = useState(dates[0]);
    const [endDate, setEndDate] = useState(dates[1]);
    const [teacher, setTeacher] = useState(null);
    const [student, setStudent] = useState(null);
    const [allStudents, setAllStudent] = useState(null);
    const [allTeachers, setAllTeachers] = useState(null);

    useEffect(() => {
        searchLessons();
     }, [startDate,endDate,teacher,student]);

     useEffect(() => {
        async function getStudents(authToken){
            try{
                let students = getStudentsAsync(authToken);
                return students;
            }
            catch(e){
                console.log('error getting students',e);
            }
        }

        async function getTeachers(authToken){
            try{
                let teachers = await getUsersAsync(authToken);
                return teachers;
            }
            catch(e){
                console.log('error getting teachers',e);
            }
        }

        async function getData(){
            if(!allStudents && props.authToken){
                console.log('getting students======');
                let students = await getStudents(props.authToken);
                setAllStudent(students);
            }

            if(!allTeachers && props.authToken){
                console.log('getting teachers======');
                let teachers = await getTeachers(props.authToken);
                setAllTeachers(teachers);
            }
        }

        getData();
        
        console.log('should run on init?');
        console.log('all students: ',allStudents);
        console.log('all teachers: ',allTeachers);
     },[]);
    const studentFilter = allStudents ? allStudents.map(student => (<p key={student.firstName + student.lastName}>{student.firstName}</p>)) : [];
    const teacherFilter = allTeachers ? allTeachers.map(teacher => (<p key={teacher.username}>{teacher.username}</p>)) : [];
    return(
        <Grid container>
            <Grid item md={3} xs={12}>
                {studentFilter}
            </Grid>
            <Grid item md={3} xs={12}>
                {teacherFilter}
            </Grid>
            <Grid item md={3} xs={12}> 
                <DatePicker 
                label="Start Date" 
                dateVal={endDate} 
                dateUpdated={dateUpdated} target="endDate"/>
            </Grid>
            <Grid item md={3} xs={12}>
                <DatePicker 
                label="End Date" 
                dateVal={startDate} 
                dateUpdated={dateUpdated} target="startDate"/>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken
});

export default connect(mapStateToProps)(FilterControls);