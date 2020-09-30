import React, { useState, useEffect  } from 'react';
import {generalSearch} from '../../actions/lessonActions';
import {getStudentsAsync} from '../../actions/studentActions';
import {getUsersAsync} from '../../actions/userActions';
import {connect} from 'react-redux';
import DatePicker from './date-picker';
import Grid from '@material-ui/core/Grid';
import {useGetStudents,useGetTeachers} from '../../effects/getData';
import FilterControl from './filter-control';
import Button from '@material-ui/core/Button';
import './styles/filter-controls.css';

function FilterControls(props){
    const startDateType = 'startDate';
    const endDateType = 'endDate';
    const studentTarget = 'fullName';
    const teacherTarget = 'username';

    const setInitialDates = () => {
        let startDate = !props.startDate ? new Date() : new Date(props.startDate);
        startDate.setDate(startDate.getDate() + 1);
        let endDate = !props.endDate ? new Date(startDate) : new Date(props.endDate);
        endDate.setDate(endDate.getDate() + 1);
        const defaultRange = 30;
        endDate.setDate(endDate.getDate() - defaultRange);
        let dates = [startDate,endDate];

        return dates;
    }

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

    const searchLessons = async () =>{
        console.log('dispatch lesson search',filters);
        //send data to lesson view for component to use
        props.dispatch(generalSearch(filters));
    }

    const filterChanged = (newVal,changeType) =>{
        let curFilters = {...filters};
        console.log(newVal);

        try{
            if(changeType === studentTarget){
                curFilters.studentId = newVal ? newVal.id : null;
            }
            else if(changeType === teacherTarget){
                curFilters.teacherId = newVal ? newVal.id : null;
            }
            setFilters(curFilters);
        }
        catch(e){
            console.log('error updating filters',e);
        }

    }

    const searchSubmit = () => {
        searchLessons();
    }

    
    //const [startDate, setStartDate] = useState(dates[0]);
    //const [endDate, setEndDate] = useState(dates[1]);
    //const [teacher, setTeacher] = useState(null);
    //const [student, setStudent] = useState(null);
    
    const dates = setInitialDates();
    const [filters,setFilters] = useState({
        teacherId:null,
        studentId:null,
        startDate:dates[0],
        endDate:dates[1]
    });
    
    //initial get lesosns
    useEffect(() => {
        searchLessons();
     }, []);
     
    const allStudents = useGetStudents(props.authToken);
    const allTeachers = useGetTeachers(props.authToken);
     
    console.log('all teachers',allTeachers);
    console.log('all students',allStudents)

    const studentFilter = allStudents ? (<FilterControl responses={allStudents} target={studentTarget} changeData={studentTarget} filterChanged={filterChanged} title={"Name"}/>) : null;
    const teacherFilter = allTeachers ? (<FilterControl responses={allTeachers} target={teacherTarget} changeData={teacherTarget} filterChanged={filterChanged} title={"Email"}/>) : null;
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
                <Grid item container xs={12} alignItems="center">
                    <Grid item xs={6}>
                        <DatePicker 
                        label="End Date" 
                        dateVal={filters.startDate} 
                        dateUpdated={dateUpdated} target="startDate"/>
                    </Grid>
                    <Grid item xs={6}>
                        <Button variant="contained" color="primary" onClick={(e) => searchSubmit(e)}>
                            Search
                        </Button>
                    </Grid> 
                </Grid>
            </Grid>
        </Grid>
    )
}

const mapStateToProps = state => ({
    authToken: state.auth.authToken
});

export default connect(mapStateToProps)(FilterControls);