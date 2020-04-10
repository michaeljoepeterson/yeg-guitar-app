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
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import './styles/create-lesson.css';

export class CreateLesson extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            teacher:this.props.currentUser.id,
            students:[],
            notes:null,
            date: new Date(),
            lessonType:'Finger Style',
            student:'',
            studentCount:1
        };
    }

    componentDidMount(){
        this.props.dispatch(getStudents())

        .then(response => {
            let currentStudents = [...this.state.students];
            currentStudents.push({
                id:this.props.students[0].id,
                fullName:this.props.students[0].fullName
            });
            this.setState({
                student:this.props.students[0].fullName,
                students:currentStudents
            });
        })

        .catch(err => {

        });
    }

    fieldChanged = (event,field) => {
        event.persist();
        let value = event.target.value;
        this.setState({
            [field]:value
        });
    }

    findStudent(id){
        return this.props.students.find(student => student.id === id);
    }

    studentChanged = (event,index) => {
        event.persist();
        let value = event.target.value;
        let students = [...this.state.students];
        let selectedStudent = this.findStudent(value);
        let newStudent = {
            id:selectedStudent.id,
            fullName:selectedStudent.fullName
        };
        students[index] = newStudent;

        this.setState({
            students
        });
    }

    buildStudentSelect = () => {
        let studentSelect = [];

        for(let i = 0;i < this.props.students.length;i++){
            const item = this.props.students[i];
            studentSelect.push(
                <MenuItem value={item.id} key={i}>{item.fullName}</MenuItem>
            );
           
        }

        let selects = [];

        for(let i = 0;i < this.state.studentCount;i++){
            selects.push(
                <Grid className="student-row" item xs={12} md={3}>
                    <Select onChange={(e) => this.studentChanged(e,i)} value={this.state.students[i].id} key={i}>{studentSelect}</Select>
                </Grid>
            )
        }

        let finalSelect = [];
        finalSelect.push(
            <Grid container item xs={12}>
                {selects}
            </Grid>
        );
        
        return finalSelect;
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

    addStudent = () => {
        const studentCount = this.state.studentCount + 1;
        const blankStudent = {
            id:this.props.students[0].id,
            fullName:this.props.students[0].fullName
        };
        let students = [...this.state.students];
        students.push(blankStudent);
        this.setState({
            studentCount,
            students
        });
    }

    render(){
        console.log(this.state);
        // console.log(this.props);
        let lessonItems = this.props.lessonTypes ? this.buildLessonSelect() : [];
        let studentItems = this.props.students && this.state.students.length > 0 ? this.buildStudentSelect() : [];
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
                        <Grid item xs={12} md={6}>
                            <IconButton aria-label="add student" onClick={(e) => this.addStudent()}>
                                <AddCircleOutlinedIcon />
                            </IconButton>
                            <InputLabel className="student-label" id="student">Students</InputLabel>
                            {studentItems}
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
    students:state.students.students
});
export default requiresLogin()(withRouter(connect(mapStateToProps)(CreateLesson)));