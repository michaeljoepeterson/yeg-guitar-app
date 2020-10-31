import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getMyLessons} from '../actions/lessonActions';
import LessonDisplay from './sub-components/lesson-display';
import Grid from '@material-ui/core/Grid';
import DatePicker from './sub-components/date-picker';
import GetUrlFilters from '../HOC/get-url-filters';

export class MyLessons extends React.Component{
    constructor(props) {
        super(props);
        let startDate;
        let endDate;
        //only wnat this to run once so can't do this in mount
        if(props.startDate && props.endDate){
            startDate = new Date(props.endDate);
            endDate = new Date(props.startDate);
        }
        else{
            startDate = new Date();
            startDate.setDate(startDate.getDate() + 1);
            endDate = new Date(startDate);
            endDate.setDate(endDate.getDate() + 1);
            const defaultRange = 30;
            endDate.setDate(endDate.getDate() - defaultRange);
        }
        this.state = {
            startDate,
            endDate
        };
    }

    componentDidMount(){
        this.updateLessonSearch();
    }

    updateLessonSearch = () =>{
        let email = this.props.currentUser.username;
        this.props.dispatch(getMyLessons(email,this.state.startDate,this.state.endDate));
    }

    dateUpdated = (event, dateField) =>{
        let date = new Date(event);
        this.setState({
            [dateField]:date
        }, () => {
            this.updateLessonSearch();
        });
        
    }

    render(){
        //console.log(this.state);
        return(
            <div>
                <h2>My lessons</h2>
                <Grid container>
                    <Grid item sm={6} xs={12}>
                        <DatePicker 
                        label="Start Date" 
                        dateVal={this.state.endDate} 
                        dateUpdated={this.dateUpdated} target="endDate"/>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <DatePicker 
                        label="End Date" 
                        dateVal={this.state.startDate} 
                        dateUpdated={this.dateUpdated} target="startDate"/>
                    </Grid>
                </Grid>
                <LessonDisplay editable={true}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});

export default GetUrlFilters()(CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(MyLessons)))));