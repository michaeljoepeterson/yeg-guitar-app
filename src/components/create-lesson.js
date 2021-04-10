import React from 'react';
import requiresLogin from '../HOC/requires-login';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { MenuItem, Icon } from '@material-ui/core';
import InputLabel from '@material-ui/core/InputLabel';
import {getStudents} from '../actions/studentActions';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Help from '@material-ui/icons/Help';
import {saveLesson,updateLesson,getStudentLesson,getLessonTypes} from '../actions/lessonActions';
import SnackbarWrapper from './snackbar-wrapper';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardDatePicker,KeyboardTimePicker } from '@material-ui/pickers';
import SimpleModal from './sub-components/simple-modal';
import LessonDisplay from './sub-components/lesson-display';
import Tooltip from '@material-ui/core/Tooltip';
import FilterControl from './sub-components/filter-control';
import { Lesson } from '../models/lesson';
import './styles/create-lesson.css';
import { Student } from '../models/student';

export class CreateLesson extends React.Component{
    constructor(props) {
        super(props);
        this.createPath = 'create-lesson';
        this.studentModal = 'studentModalOpen';
        this.studentTarget = 'fullName';
        this.state = {
            lesson:new Lesson({
                teacher:this.props.currentUser.id,
                date:new Date()
            }),
            teacher:this.props.currentUser.id,
            students:[],
            notes:'',
            date: new Date(),
            lessonType:'',
            studentCount:1,
            saved:false,
            savedMessage:'Saved',
            time:null,
            modalOpen:false,
            modalMessage:'Are you sure you want to create a class with no students?',
            studentModalOpen:false
        };
    }

    async componentDidMount(){
        try{
            await this.props.dispatch(getLessonTypes());
            await this.props.dispatch(getStudents())
            let currentStudents = this.state.students.map(student => new Student(student));
            let firstStudent = this.props.students.find(student => student.active);
            currentStudents.push(new Student(firstStudent));
            let lesson = new Lesson(this.state.lesson);
            lesson.students = currentStudents.map(student => new Student(student));
            this.setState({
                students:currentStudents,
                lesson
            },() => {
                this.checkSelectedLesson()
            });
        }
        catch(e){
            
        }
    }

    checkEditMode = () => {
        return !this.props.location.pathname.includes(this.createPath);
    }

    checkSelectedLesson = () =>{
        //console.log(this.props.selectedLesson);
        let isEdit = this.checkEditMode();
        if(this.props.selectedLesson && isEdit){
            let selectedLesson = this.props.selectedLesson;
            let lessonData = {
                students:selectedLesson.students,
                notes:selectedLesson.notes,
                date: new Date(selectedLesson.date),
                lessonType:selectedLesson.lessonType,
                time: new Date(selectedLesson.date)
            };
            let lesson = new Lesson(lessonData);
            lesson.teacher = selectedLesson.teacher.id;
            this.setState({
                teacher:selectedLesson.teacher.id,
                students:selectedLesson.students,
                notes:selectedLesson.notes,
                date: new Date(selectedLesson.date),
                lessonType:selectedLesson.lessonType,
                studentCount:selectedLesson.students.length,
                time: new Date(selectedLesson.date),
                lesson
            });
        }
    }

    fieldChanged = (event,field) => {
        event.persist();
        let value = event.target.value;
        let lesson = new Lesson(this.state.lesson);
        lesson[field] = value;
        this.setState({
            [field]:value,
            lesson
        });
    }

    findStudent(id){
        return this.props.students.find(student => student.id === id);
    }

    studentChanged = (event,target,index) => {
        //event.persist();
        if(event && event.id){
            let value = event;
            let students = [...this.state.students];
            let selectedStudent = this.findStudent(value.id);
            let newStudent = {...selectedStudent};
            students[index] = newStudent;
            let lesson = new Lesson(this.state.lesson);
            lesson.students = students.map(student => new Student(student));
            this.setState({
                students,
                lesson
            });
        }
    }

    getStudentLessons = async (id) =>{
        try{
            await this.props.dispatch(getStudentLesson(id))
            this.modalOpened(this.studentModal);
        }
        catch(err){
            console.log(err);
        }
        
    }

    buildStudentSelect = () => {

        let selects = [];
        const activeProp = 'active';
        for(let i = 0;i < this.state.studentCount;i++){
            selects.push(
                <Grid className="student-row" item xs={12} md={6} xl={4} key={this.state.students[i].id + i}>
                    <div className="filter-container-lesson">
                        <Tooltip title="See Previous Lessons">
                            <IconButton onClick={(e) => this.getStudentLessons(this.state.students[i].id)} aria-label="student lessons">
                                <Help/>
                            </IconButton>
                        </Tooltip>
                        <FilterControl 
                        responses={this.props.students} 
                        target={this.studentTarget} 
                        changeData={i} 
                        filterChanged={this.studentChanged} 
                        title={"Name"} 
                        value={this.state.students[i] ? this.state.students[i] : null }
                        ignoreEmpty={true}
                        activeProp={activeProp}/>
                        <Tooltip title="Remove Student">
                            <IconButton onClick={(e) => this.removeStudent(i)} aria-label="remove student">
                                <CancelOutlinedIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>
                </Grid> 
            );
        }

        let finalSelect = [];
        finalSelect.push(
            <Grid container item xs={12} key={0}>
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
        const blankStudent = new Student ({
            id:this.props.students[0].id,
            fullName:this.props.students[0].fullName
        });
        let students = [...this.state.students];
        students.push(blankStudent);
        let lesson = new Lesson(this.state.lesson);
        lesson.students = students.map(student => new Student(student));
        this.setState({
            studentCount,
            students,
            lesson
        });
    }

    removeStudent = (index) => {
        const studentCount = this.state.studentCount - 1;
        let students = this.state.students.filter((student,i) => i !== index);
        let lesson = new Lesson(this.state.lesson);
        lesson.students = students.map(student => new Student(student));
        this.setState({
            studentCount,
            students,
            lesson
        });
    }

    buildDateString = (date) =>{
        return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
    }

    saveLesson = (event,checkedModal) => {
        if(event){
            event.persist();
            event.preventDefault();
        }
        if(!checkedModal && this.state.students.length === 0){
            this.setState({
                modalOpen:true
            });
            return;
        }
        this.setState({
            modalOpen:false
        });
        let isEdit = this.checkEditMode();
        let dateTime  = new Date(this.state.date.getFullYear(), this.state.date.getMonth(), this.state.date.getDate(), this.state.time.getHours(), this.state.time.getMinutes(),0); 
        
        const lesson = {
            date:dateTime,
            lessonType:this.state.lessonType,
            notes:this.state.notes,
            teacher:this.state.teacher,
            students:this.state.students.map(student => student.id)
        }
        if(!isEdit){
        
            //console.log(lesson);

            this.props.dispatch(saveLesson(lesson))

            .then(res => {
                let {code} = res;
                
                if(code === 200){
                    let startDate = new Date();
                    let endDate = new Date(startDate);
                    //endDate.setDate(endDate.getDate() + 1);
                    let startDateString = this.buildDateString(startDate);
                    let endDateString = this.buildDateString(endDate);
                    this.props.history.push(`/my-lessons?startdate=${startDateString}&enddate=${endDateString}&teacher=${this.props.currentUser.username}`);
                }
                else{
                    this.setState({
                        saved:true,
                        savedMessage:'Error saving lesson'
                    });
                }
            })

            .catch(err => {
                console.log(err);
            });
        }
        else{
            const lesson = {
                date:dateTime,
                lessonType:this.state.lessonType,
                notes:this.state.notes,
                teacher:this.state.teacher,
                students:this.state.students.map(student => student.id),
                id:this.props.selectedLesson.id
            }

            //console.log(lesson);

            this.props.dispatch(updateLesson(lesson))

            .then(res => {
                let {code} = res;
                
                if(code === 200){
                    this.setState({
                        saved:true,
                        savedMessage:'Lesson Updated!'
                    });
                }
                else{
                    //console.log(res)
                    this.setState({
                        saved:true,
                        savedMessage:'Error updating lesson'
                    });
                }
            })

            .catch(err => {
                console.log(err);
            });
        }
        
    }

    snackbarClosed = (name) => {
        this.setState({
            [name]:false
        });
    }

    handleDateChange = (event) =>{
        let date = new Date(event);
        let lesson = new Lesson(this.state.lesson);
        lesson.date = date;
        this.setState({
            date,
            lesson
        });
    }

    handleTimeChange = (event) =>{
        let time = new Date(event);
        let lesson = new Lesson(this.state.lesson);
        lesson.time = time;
        this.setState({
            time,
            lesson
        });
    }

    modalOpened = (name) => {
        this.setState({
            [name]:true
        });
    }

    modalClosed = (name) => {
        this.setState({
            [name]:false
        });
    }

    modalSubmitted = () => {
        this.saveLesson(null,true)
    }

    buildStudentLessons = () => {
        let lessons = [];

        for(let i = 0;i < this.props.studentLessons.length;i++){
            let lesson = this.props.studentLessons[i];
            let list = (<p>{lesson.id} : {lesson.lessonType}</p>);
            lessons.push(list);
        }

        return lessons;
    }

    render(){
        console.log(this.state);
        let lessonItems = this.props.lessonTypes ? this.buildLessonSelect() : [];
        let studentItems = this.props.students && this.props.students.length > 0 && this.state.students.length > 0 ? this.buildStudentSelect() : [];
        let studentLessonList = this.props.studentLessons ? (<LessonDisplay studentLessons={this.props.studentLessons}/>) : null;
        
        return(
            <div>
                <form onSubmit={(e) => this.saveLesson(e)}>
                    <Grid container>
                        <Grid item sm={6} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                            <KeyboardDatePicker
                                margin="normal"
                                id="date-picker-dialog"
                                label="Lesson Date"
                                format="MM/dd/yyyy"
                                value={this.state.date}
                                onChange={this.handleDateChange}
                                KeyboardButtonProps={{
                                    'aria-label': 'change date',
                                }}
                                required
                            />
                        </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item sm={6} xs={12}>
                        <MuiPickersUtilsProvider utils={DateFnsUtils}>
                        <KeyboardTimePicker
                            margin="normal"
                            id="time-picker"
                            label="Lesson Time"
                            value={this.state.time}
                            onChange={this.handleTimeChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            required
                        />
                        </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField required className="notes-field" label="Notes" id="notes" multiline rows="5" value={this.state.notes} onChange={(e) => this.fieldChanged(e,'notes')}/>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="lesson-container">
                                <InputLabel id="lessonType">Lesson Type</InputLabel>
                                <Select required onChange={(e) => this.fieldChanged(e,'lessonType')} id="lessonType" value={this.state.lessonType}>
                                    {lessonItems}
                                </Select>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <Tooltip title="Add a Student">
                                <IconButton aria-label="add student" onClick={(e) => this.addStudent()}>
                                    <AddCircleOutlinedIcon />
                                </IconButton>
                            </Tooltip>
                            <InputLabel className="student-label" id="student">Students</InputLabel>
                            {studentItems}
                        </Grid>
                        <Grid className="" item xs={12}>
                            <Button type="submit" variant="contained">{this.props.editable ? 'Update' : 'Save'}</Button>
                        </Grid>
                    </Grid>
                </form>
                
                <SnackbarWrapper saved={this.state.saved} snackbarClosed={this.snackbarClosed} saveField={"saved"} savedMessage={this.state.savedMessage}/>
                <SimpleModal open={this.state.modalOpen} handleClose={this.modalClosed} submitClick={this.modalSubmitted} message={this.state.modalMessage} name={"modalOpen"}/>
                <SimpleModal open={this.state.studentModalOpen} handleClose={this.modalClosed} name={this.studentModal}>
                    {studentLessonList}
                </SimpleModal>
            </div>
        );
    }
}

const mapStateToProps = state => {
    let types = state.lessons.lessonTypes.filter(type => type.active).map(type => type.name);
    return{
        currentUser: state.auth.currentUser,
        lessonTypes:types,
        students:state.students.students,
        selectedLesson:state.lessons.selectedLesson,
        studentLessons:state.lessons.studentLessons
    };
};
export default requiresLogin()(withRouter(connect(mapStateToProps)(CreateLesson)));