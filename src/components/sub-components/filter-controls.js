import React, { useState, useEffect  } from 'react';
import {connect} from 'react-redux';
import DatePicker from './date-picker';
import Grid from '@material-ui/core/Grid';
import {useGetStudents,useGetTeachers} from '../../effects/getData';
import {useFilterLessons} from '../../effects/filterLessons';
import FilterControl from './filter-control';
import './styles/filter-controls.css';

function FilterControls(props){
    const startDateType = 'startDate';
    const endDateType = 'endDate';
    const studentTarget = 'fullName';
    const teacherTarget = 'fullName';
    const teacherChange = 'fullNameTeacher';
    

    const setInitialDates = () => {
        let startDate = !props.startDate ? new Date() : new Date(props.startDate);
        if(!props.startDate){
            startDate.setDate(startDate.getDate() + 1);
        }
        let endDate = !props.endDate ? new Date(startDate) : new Date(props.endDate);
        if(!props.endDate){
            endDate.setDate(endDate.getDate() + 1);
            const defaultRange = 30;
            endDate.setDate(endDate.getDate() - defaultRange);
        }
        let dates = [startDate,endDate];
        return dates;
    }

    const dates = setInitialDates();
    const [filters,setFilters] = useState({
        teacherId:props.teacher ? props.teacher.id : null,
        studentId:props.studentId ? props.studentId : null,
        startDate:dates[0],
        endDate:dates[1],
        selectedTeacher:props.teacher ? props.teacher : null,
        selectedStudent:props.student ? props.student : null,
        selectedDate:props.date ? props.date : null
    });

    const dateUpdated = (event, dateField) => {
        let newDate = new Date(event);
        console.log('updating date');
        let curFilters = {...filters};
        if(dateField === startDateType){
            curFilters.startDate = newDate;
        }
        else if(dateField === endDateType){
            curFilters.endDate = newDate;
        }
        setFilters(curFilters);
    }

    const filterChanged = (newVal,changeType,changeData) =>{
        let curFilters = {...filters};
        //console.log(newVal);

        try{
            if(changeData === studentTarget){
                curFilters.studentId = newVal ? newVal.id : null;
                curFilters.selectedStudent = newVal;
                if(props.updateStudent){
                    props.updateStudent(newVal);
                }
            }
            else if(changeData === teacherChange){
                curFilters.teacherId = newVal ? newVal.id : null;
                curFilters.selectedTeacher = newVal;
            }
            if(props.filterChanged){
                props.filterChanged(newVal,changeType,changeData);
            }
            setFilters(curFilters);
        }
        catch(e){
            console.log('error updating filters',e);
        }

    }

    
    //reset selected student when student updated
    useEffect(() => {
        try{
            let currFilter = {...filters};
            if(currFilter.selectedStudent){
                let selectedStudent = props.students.find(student => student.id === currFilter.selectedStudent.id);
                currFilter.selectedStudent = selectedStudent;
            }
            else{
                currFilter.selectedStudent = null;
            }
            setFilters(currFilter);
        }
        catch(e){
            console.log('error reseting selected student',e);
        }
    },[props.students]);    
    
    //could eventually extract to cust effect?
    useEffect(() => {
        let currFilter = {...filters};
        currFilter.studentId = props.student ? props.student.id : null;
        currFilter.teacherId = props.teacher ? props.teacher.id : null;
        currFilter.selectedStudent = props.student;
        currFilter.selectedTeacher = props.teacher;

        console.log('changed filter: ',props.teacher);
        setFilters(currFilter);
    }, [props.teacher,props.student]);
    
    useEffect(() => {
        let currFilter = {...filters};
        if(props.selectedDate){
            let tomorrow = new Date(props.selectedDate);
            tomorrow.setDate(props.selectedDate.getDate() + 1);
            currFilter.startDate = tomorrow;
            currFilter.endDate = props.selectedDate;
            currFilter.selectedDate = props.selectedDate;
        }
        setFilters(currFilter);
    }, [props.selectedDate]);
    
    
    let allStudents = useGetStudents(props.authToken,props.students);
    //let allStudents = props.students;
    let allTeachers = useGetTeachers(props.authToken,props.dispatch); 
    //effect to get lessons
    useFilterLessons(filters,props.dispatch);
    //console.log('all teachers',allTeachers);
    //console.log('all teacher ',allTeachers)
    debugger;
    const studentFilter = allStudents ? (<FilterControl responses={allStudents} target={studentTarget} changeData={studentTarget} filterChanged={filterChanged} title={"Name"} value={filters.selectedStudent} ignoreEmpty={true} activeProp={props.user.level <= 1 ? null : props.studentActive}/>) : null;
    const teacherFilter = allTeachers ? (<FilterControl responses={allTeachers} target={teacherTarget} changeData={teacherChange} filterChanged={filterChanged} title={"Teacher"} value={filters.selectedTeacher} ignoreEmpty={true}/>) : null;
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
                dateVal={filters.endDate} 
                dateUpdated={dateUpdated} target="endDate"/>
            </Grid>
            <Grid item md={3} xs={12}>
                    <DatePicker 
                    label="End Date" 
                    dateVal={filters.startDate} 
                    dateUpdated={dateUpdated} target="startDate"/>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken,
    students:state.students.students,
    user: state.auth.currentUser
});

export default connect(mapStateToProps)(FilterControls);