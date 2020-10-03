import React, { useState  } from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import LessonViewTable from './sub-components/lesson-view-table';
import FilterControls from './sub-components/filter-controls';

function StudentLessonPage(props){
    const [student,setStudent] = useState(null);
    const [teacher,setTeacher] = useState(null);
    const [selectedDate,setSelectedDate] = useState(null);
    console.log('rerendered page');

    const teacherClicked = (teacher) =>{
        setTeacher(teacher); 
    }

    const studentClicked = (student) =>{
        setStudent(student);
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

    return(
        <div>
            <FilterControls student={student} teacher={teacher} filterChanged={filterChanged} selectedDate={selectedDate}/>
            <LessonViewTable studentClicked={studentClicked} teacherClicked={teacherClicked} dateClicked={dateClicked}/>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});
export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(StudentLessonPage))));