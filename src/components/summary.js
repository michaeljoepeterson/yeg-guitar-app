import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getUsers} from '../actions/userActions';
import UserList from './sub-components/user-list';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardDatePicker } from '@material-ui/pickers';

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
            selectedId:null
        };
    }

    componentDidMount(){
        let id = this.checkSingleView();
        if(id){

        }
        else{
            this.findUsers();
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
            this.updateLessonSearch();
        });
        
    }

    render(){
        console.log(this.props);
        return(
            <div>
                <h2>Summary</h2>
                <Grid container>
                    <Grid item sm={6} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Start Date"
                                format="MM/dd/yyyy"
                                value={this.state.startDate}
                                onChange={(e) => this.dateUpdated(e,'startDate')}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                    <Grid item sm={6} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="End Date"
                                format="MM/dd/yyyy"
                                value={this.state.endDate}
                                onChange={(e) => this.dateUpdated(e,'endDate')}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                            />
                        </MuiPickersUtilsProvider>
                    </Grid>
                </Grid>
                <UserList summary={true} users={this.props.users}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    users:state.users.users
});

export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(Summary))));