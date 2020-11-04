import React, { useState  } from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import LessonViewTable from './sub-components/lesson-view-table';
import FilterControls from './sub-components/filter-controls';
import StudentDetails from './sub-components/student-details';
import Grid from '@material-ui/core/Grid';

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

    const filterChanged = (newVal,changeType) =>{
        const studentTarget = 'fullName';
        const teacherTarget = 'username';

        if(changeType === studentTarget){
            setStudent(newVal);
        }
        else if(changeType === teacherTarget){
            setTeacher(newVal);
        }
    }
    
    const activeProp = 'active';

    return(
        <div>
            <FilterControls student={student} teacher={teacher} filterChanged={filterChanged} selectedDate={selectedDate}studentActive={activeProp} updateStudent={updateSelectedStudent}/>
            <Grid container>
                <Grid item md={3} xs={12}>
                    <StudentDetails student={selectedStudent}/>
                </Grid>
            </Grid>
            <LessonViewTable studentClicked={studentClicked} teacherClicked={teacherClicked} dateClicked={dateClicked}/>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});
export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(StudentLessonPage))));