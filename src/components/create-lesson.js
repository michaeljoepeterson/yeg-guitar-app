import React from 'react';
import requiresLogin from '../HOC/requires-login';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import {getStudents} from '../actions/studentActions';

export class CreateLesson extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            teacher:this.props.currentUser.id,
            students:[],
            notes:null,
            date: new Date(),
            lessonType:'Finger Style'
        };
    }

    componentDidMount(){
        this.props.dispatch(getStudents());
    }

    fieldChanged = (event,field) => {
        event.persist();
        console.log(event);
        let value = event.target.value;
        this.setState({
            field:value
        });
    }

    buildLessonSelect = () => {
        let lessonItems = [];

        for(let i = 0;i < this.props.lessonTypes.length;i++){
            const item = this.props.lessonTypes[i];
            lessonItems.push(
                <MenuItem value={item} key={i}>{item}</MenuItem>
            );
        }

        return lessonItems;
    }

    render(){
        console.log(this.state);
        console.log(this.props);
        let lessonItems = this.props.lessonTypes ? this.buildLessonSelect() : [];
        return(
            <div>
                <form>
                    <Grid container>
                    <Grid item xs={12} md={6}>
                        <InputLabel id="lessonType">Lesson Type</InputLabel>
                        <Select onChange={(e) => this.fieldChanged(e,'lessonType')} id="lessonType" value={this.state.lessonType}>
                            {lessonItems}
                        </Select>
                    </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessonTypes:['Finger Style','Chords', 'Rythm'],
    students:state.students.student
});
export default requiresLogin()(withRouter(connect(mapStateToProps)(CreateLesson)));