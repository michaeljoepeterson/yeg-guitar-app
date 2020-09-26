import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUsers} from '../actions/userActions';
import {getLessonSummary} from '../actions/lessonActions';
import UserList from './sub-components/user-list';
import SummaryView from './sub-components/summary-view';
import Grid from '@material-ui/core/Grid';
import DatePicker from './sub-components/date-picker';

export class Summary extends React.Component{
    constructor(props) {
        super(props);
        let startDate = new Date();
        startDate.setDate(startDate.getDate() + 1);
        let endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        const defaultRange = 30;
        endDate.setDate(endDate.getDate() - defaultRange);
        this.state = {
            startDate,
            endDate,
            selectedId:null,
            lessonData:null
        };
    }

    componentDidMount(){
        let id = this.checkSingleView();
        if(id){
            this.updateUserSummary(id);
        }
        else{
            this.findUsers();
        }
    }

    updateUserSummary = (id) => {
        id = id ? id : this.state.selectedId;
        if(id){
            this.props.dispatch(getLessonSummary(id,this.state.startDate,this.state.endDate))
            .then(lessonData => {
                console.log('lesson data: ',lessonData.lessonData);
                this.setState({
                    lessonData:lessonData.lessonData
                });
            })

            .catch(err => {
                console.log(err);
            })
        }
    }

    checkSingleView = () => {
        let id = this.props.match.params.id;
        this.setState({
            selectedId:id
        });
        return id;
    }

    findUsers = () =>{
        this.props.dispatch(getUsers());
    }

    dateUpdated = (event, dateField) =>{
        let date = new Date(event);
        this.setState({
            [dateField]:date
        }, () => {
            this.updateUserSummary();
        });
        
    }

    render(){
        console.log(this.state);
        let dateSelectors = this.state.selectedId ? (
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
        </Grid>) : null;

        let list = this.state.selectedId ? null :(
        <UserList summary={true} users={this.props.users}/>
        );

        let summary = this.state.selectedId && this.state.lessonData? (
            <SummaryView data={this.state.lessonData}/>
        ) :null;
        
        return(
            <div>
                <h2>Summary</h2>
                {dateSelectors}
                {list}
                {summary}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    users:state.users.users
});

export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(Summary))));