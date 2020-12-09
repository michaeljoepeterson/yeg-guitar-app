import React, { useState,useEffect  } from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import LessonViewTable from './sub-components/lesson-view-table';
import FilterControls from './sub-components/filter-controls';
import StudentDetails from './sub-components/student-details';
import Grid from '@material-ui/core/Grid';
import {getStudents} from '../actions/studentActions';
import GetUrlFilters from '../HOC/get-url-filters';

function StudentLessonPage(props){
    const [student,setStudent] = useState(null);
    const [teacher,setTeacher] = useState(null);
    const [selectedDate,setSelectedDate] = useState(null);
    const [selectedStudent,setSelectedStudent] = useState(null);

    console.log('rerendered page');

    const teacherClicked = (teacher) =>{
        setTeacher(teacher); 
    }

    const updateSelectedStudent = (student) => {
        setSelectedStudent(student);
    }

    const studentClicked = (student) =>{
        setStudent(student);
        updateSelectedStudent(student);
    }

   const dateClicked = (date) =>{
        setSelectedDate(date);
    }

    const filterChanged = (newVal,changeType,changeData) =>{
        const studentTarget = 'fullName';
        const teacherChange = 'fullNameTeacher';

        if(changeData === studentTarget){
            setStudent(newVal);
        }
        else if(changeData === teacherChange){
            setTeacher(newVal);
        }
    }
    
    const activeProp = 'active';
    useEffect(() => {
        //props.dispatch(getStudents());
        if(props.teachers.length > 0 && props.teacher){
            //find teacher from pre populated teacher list
            //list populated by get teacher effect in filter controls
            let foundTeacher = props.teachers.find(teacher => teacher.username === props.teacher);
            setTeacher(foundTeacher);
        }
        else if(props.teachers.length > 0 && !props.teacher){
            setTeacher(null);
        }
    }, [props.teachers,props.teacher]);
    return(
        <div>
            <FilterControls student={student} teacher={teacher} filterChanged={filterChanged} selectedDate={selectedDate} studentActive={activeProp} updateStudent={updateSelectedStudent} startDate={props.endDate} endDate={props.startDate}/>
            <Grid container>
                <Grid item md={6} xs={12} className={!student ? 'hide' : ''}>
                    <StudentDetails student={selectedStudent}/>
                </Grid>
            </Grid>
            <LessonViewTable studentClicked={studentClicked} teacherClicked={teacherClicked} dateClicked={dateClicked}/>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons,
    teachers:state.users.users
});
export default GetUrlFilters()(CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(StudentLessonPage)))));