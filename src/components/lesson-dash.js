import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import LessonViewTable from './sub-components/lesson-view-table';
import FilterControls from './sub-components/filter-controls';


export class ExampleTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            student:null,
            teacher:null,
            selectedDate:null
        };
    }

    teacherClicked = (teacher) =>{
        this.setState({
            teacher:teacher
        }); 
    }

    studentClicked = (student) =>{
        this.setState({
            student:student
        }); 
    }

    dateClicked = (date) =>{
        this.setState({
            selectedDate:date
        });
    }

    filterChanged = (newVal,changeType) =>{
        const studentTarget = 'fullName';
        const teacherTarget = 'username';

        if(changeType === studentTarget){
            this.setState({
                student:newVal
            });
        }
        else if(changeType === teacherTarget){
            this.setState({
                teacher:newVal
            });
        }
    }

    render(){
        return(
            <div>
                <FilterControls student={this.state.student} teacher={this.state.teacher} filterChanged={this.filterChanged} selectedDate={this.state.selectedDate}/>
                <LessonViewTable studentClicked={this.studentClicked} teacherClicked={this.teacherClicked} dateClicked={this.dateClicked}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});
export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(ExampleTable))));