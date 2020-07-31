import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getLessons} from '../actions/lessonActions';
import LessonDisplay from './sub-components/lesson-display'

export class MyLessons extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        console.log(this.props.lessons);
        console.log(this.props.currentUser);

        return(
            <div>
                <h2>My lessons</h2>
                <LessonDisplay />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});

export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(MyLessons))));