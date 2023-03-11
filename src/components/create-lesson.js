import React from 'react';
import requiresLogin from '../HOC/requires-login';
import { withRouter} from 'react-router-dom';
import {connect, useSelector} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
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
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { useGetStudentsQuery } from '../store/api/student-api';
import { useGetLessonTypesQuery } from '../store/api/lesson-types-api';

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
            studentCount:1,
            saved:false,
            savedMessage:'Saved',
            modalOpen:false,
            modalMessage:'Are you sure you want to create a class with no students?',
            studentModalOpen:false
        };
    }

    async componentDidMount(){
        try{
            await this.props.dispatch(getLessonTypes());
            await this.props.dispatch(getStudents())
            let currentStudents = this.state.lesson.students.map(student => new Student(student));
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
    /**
     * check against a selected lesson and assign it to the lesson
     */
    checkSelectedLesson = () =>{
        let isEdit = this.checkEditMode();
        if(this.props.selectedLesson && isEdit){
            let selectedLesson = this.props.selectedLesson;
            let lessonData = {
                students:selectedLesson.students,
                notes:selectedLesson.notes,
                date: new Date(selectedLesson.date),
                lessonType:selectedLesson.lessonType,
                time: new Date(selectedLesson.date),
                id:this.props.selectedLesson.id
            };
            let lesson = new Lesson(lessonData);
            lesson.teacher = selectedLesson.teacher.id;
            this.setState({
                studentCount:selectedLesson.students.length,
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

    descriptionUpdated = (text) => {
        let lesson = new Lesson(this.state.lesson);
        lesson.notes = text;
        this.setState({
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
            let students = [...this.state.lesson.students];
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
                <Grid className="student-row" item xs={12} md={6} xl={4} key={this.state.lesson.students[i].id + i}>
                    <div className="filter-container-lesson">
                        <Tooltip title="See Previous Lessons">
                            <IconButton onClick={(e) => this.getStudentLessons(this.state.lesson.students[i].id)} aria-label="student lessons">
                                <Help/>
                            </IconButton>
                        </Tooltip>
                        <FilterControl 
                        responses={this.props.students} 
                        target={this.studentTarget} 
                        changeData={i} 
                        filterChanged={this.studentChanged} 
                        title={"Name"} 
                        value={this.state.lesson.students[i] ? this.state.lesson.students[i] : null }
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
        let students = [...this.state.lesson.students];
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
        let students = this.state.lesson.students.filter((student,i) => i !== index);
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
    /**
     * 
     * @param {*} event 
     * @param {*} checkedModal 
     * @returns 
     */
    saveLesson = (event,checkedModal) => {
        if(event){
            event.persist();
            event.preventDefault();
        }
        if(!checkedModal && this.state.lesson.students.length === 0){
            this.setState({
                modalOpen:true
            });
            return;
        }
        this.setState({
            modalOpen:false
        });
        let isEdit = this.checkEditMode();
        const lesson = this.state.lesson.getReq();
        if(!isEdit){
        
            //console.log(lesson);

            this.props.dispatch(saveLesson(lesson))

            .then(res => {
                let {code} = res;
                
                if(code === 200){
                    let startDate = new Date();
                    let endDate = new Date(startDate);
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
        //update
        else{
            const lesson = this.state.lesson.getReq();

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
        let studentItems = this.props.students && this.props.students.length > 0 && this.state.lesson.students.length > 0 ? this.buildStudentSelect() : [];
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
                                value={this.state.lesson.date}
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
                            value={this.state.lesson.time}
                            onChange={this.handleTimeChange}
                            KeyboardButtonProps={{
                                'aria-label': 'change time',
                            }}
                            required
                        />
                        </MuiPickersUtilsProvider>
                        </Grid>
                        <Grid item xs={12}>
                            {/* <TextField required className="notes-field" label="Notes" id="notes" multiline rows="5" value={this.state.lesson.notes} onChange={(e) => this.fieldChanged(e,'notes')}/> */}
                            <div className="text-editor">
                                <CKEditor
                                    editor={ ClassicEditor }
                                    data={this.state.lesson.notes}
                                    onReady={ editor => {
                                        
                                    } }
                                    onChange={ ( event, editor ) => {
                                        const data = editor.getData();
                                        console.log( { event, editor, data } );
                                        this.descriptionUpdated(data);
                                    } }
                                />
                            </div>

                        </Grid>
                        <Grid item xs={12} md={6}>
                            <div className="lesson-container">
                                <InputLabel id="lessonType">Lesson Type</InputLabel>
                                <Select required onChange={(e) => this.fieldChanged(e,'lessonType')} id="lessonType" value={this.state.lesson.lessonType}>
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

/*
const mapStateToProps = state => {
    let types = state.lessons?.lessonTypes ? state.lessons.lessonTypes.filter(type => type.active).map(type => type.name) : [];
    return{
        currentUser: state.auth.currentUser,
        lessonTypes:types,
        students:state.students.students,
        selectedLesson:state.lessons.selectedLesson,
        studentLessons:state.lessons.studentLessons
    };
};
export default requiresLogin()(withRouter(connect(mapStateToProps)(CreateLesson)));
*/
const StateWrapper = (Component) => function Comp(props){
    const auth = useSelector((state) => state.auth);
    const {currentUser, authToken} = auth;
    const {data: students} = useGetStudentsQuery(authToken);
    const {data: lessonData} = useGetLessonTypesQuery(authToken);
    const lessonTypes = lessonData ? lessonData.filter(type => type.active).map(type => type.name) : []
    return <Component lessonTypes={lessonTypes} currentUser={currentUser} students={students} {...props}/>
};

export default requiresLogin()(withRouter(StateWrapper(CreateLesson)));

