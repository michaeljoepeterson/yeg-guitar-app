import React, { useState, useEffect  } from 'react';
import {generalSearch} from '../../actions/lessonActions';
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
        props.dispatch(generalSearch());
    }

    const dates = setInitialDates();

    const [startDate, setStartDate] = useState(dates[0]);
    const [endDate, setEndDate] = useState(dates[1]);
    const [teacher, setTeacher] = useState(null);
    const [student, setStudent] = useState(null);

    useEffect(() => {
        searchLessons();
     }, [startDate,endDate,teacher,student]);

    return(
        <Grid container>
            <Grid>
                <p>filter Teacher</p>
            </Grid>
            <Grid>
                <p>filter Student</p>
            </Grid>
            <Grid>
                <DatePicker 
                label="Start Date" 
                dateVal={endDate} 
                dateUpdated={dateUpdated} target="endDate"/>
            </Grid>
            <Grid>
                <DatePicker 
                label="End Date" 
                dateVal={startDate} 
                dateUpdated={dateUpdated} target="startDate"/>
            </Grid>
        </Grid>
    )
}


export default connect()(FilterControls);