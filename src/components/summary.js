import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {withRouter} from 'react-router-dom';
import {useSelector} from 'react-redux';
import UserList from './sub-components/user-list';
import SummaryView from './sub-components/summary-view';
import Grid from '@material-ui/core/Grid';
import DatePicker from './sub-components/date-picker';
import { useGetUsersQuery } from '../store/api/users-api';
import { useLazyGetLessonSummaryQuery } from '../store/api/lesson-api';

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
    }

    updateUserSummary = (id) => {
        id = id ? id : this.state.selectedId;
        if(id){
            this.props.getLessonSummary(id, this.state.startDate, this.state.endDate);
        }
    }

    checkSingleView = () => {
        let id = this.props.match.params.id;
        this.setState({
            selectedId:id
        });
        return id;
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
        let filteredUsers = this.props.currentUser.level >= 2 ? this.props.users.filter(user => user.username === this.props.currentUser.username) : [...this.props.users];
        let list = this.state.selectedId ? null :(
        <UserList summary={true} users={filteredUsers}/>
        );

        let summary = this.state.selectedId && this.props.lessonSummary ? (
            <SummaryView data={this.props.lessonSummary}/>
        ) : null;
        
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


const StateWrapper = (Component) => function Comp(props){
    const {authToken, currentUser} = useSelector(state => state.auth);
    const {data: users} = useGetUsersQuery({authToken}); 
    const [getSummary, {data: lessonSummary}] = useLazyGetLessonSummaryQuery();
    const getLessonSummary = async (id, startDate, endDate) => {
        try{
            getSummary({authToken, id, startDate, endDate}, true);
        }
        catch(e){
            console.warn(e);
        }
    };

    if(!users){
        return null;
    }

    return (
        <>
            <Component
                users={users}
                currentUser={currentUser}
                getLessonSummary={getLessonSummary}
                lessonSummary={lessonSummary}
                {...props}
            />
        </>
    );
}

export default CheckPermission()(requiresLogin()((withRouter(StateWrapper(Summary)))));