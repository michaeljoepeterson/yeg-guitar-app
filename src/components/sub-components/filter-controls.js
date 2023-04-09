import React, { useState, useEffect, useMemo  } from 'react';
import {useSelector} from 'react-redux';
import DatePicker from './date-picker';
import Grid from '@material-ui/core/Grid';
import FilterControl from './filter-control';
import './styles/filter-controls.css';
import { useGetUsersQuery } from '../../store/api/users-api';
import { useGetStudentsQuery } from '../../store/api/student-api';

function FilterControls(props){
    const startDateType = 'startDate';
    const endDateType = 'endDate';
    const studentTarget = 'fullName';
    const teacherTarget = 'fullName';
    const teacherChange = 'fullNameTeacher';
    const dates = useMemo(() => {
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
    }, [props.startDate, props.endDate]);
    const [filters,setFilters] = useState({
        teacherId:props.teacher ? props.teacher.id : null,
        studentId:props.studentId ? props.studentId : null,
        startDate:dates[0],
        endDate:dates[1],
        selectedTeacher:props.teacher ? props.teacher : null,
        selectedStudent:props.student ? props.student : null,
        selectedDate:props.date ? props.date : null
    });
    const {authToken, currentUser} = useSelector(state => state.auth);
    //these should really be passed to component
    const {data: allStudents} = useGetStudentsQuery({authToken});
    const {data: allTeachers} = useGetUsersQuery({authToken});

    useEffect(() => {
        if(props.onFiltersChanged){
            props.onFiltersChanged(filters);
        }
    }, [filters]);
    
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

    if(!currentUser){
        return null;
    }

    const dateUpdated = (event, dateField) => {
        let newDate = new Date(event);
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

    const studentFilter = allStudents ? (<FilterControl responses={allStudents} target={studentTarget} changeData={studentTarget} filterChanged={filterChanged} title={"Name"} value={filters.selectedStudent} ignoreEmpty={true} activeProp={currentUser.level <= 1 ? null : props.studentActive}/>) : null;
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

export default FilterControls;