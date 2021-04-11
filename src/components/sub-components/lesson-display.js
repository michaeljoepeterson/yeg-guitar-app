import React from 'react';
import {connect} from 'react-redux';
import {withRouter } from 'react-router-dom';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {setSelectedLesson} from '../../actions/lessonActions';


export class LessonDisplay extends React.Component{
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    componentDidMount(){
        //this.props.dispatch(getLessons())
    }

    setSelectedLesson = (lesson) => {
        console.log('selected lesson: ',lesson);
        this.props.dispatch(setSelectedLesson(lesson));
        this.props.history.push(`/edit-lesson/${lesson.id}`);
    }

    studentClicked = (student) => {
        console.log('student clicked: ',student);
    }

    buildStudentSpans = (students) =>{
        let spans = students.map((student,i) => {
            return (<span onClick={(e) => this.studentClicked(student)} key={student.firstName + i}>{student.firstName + ' ' + student.lastName}{i === students.length - 1 ? '' : ','}</span>);
        });

        return spans;
    }

    buildTable = (lessons) =>{

        let rows = [];
        for(let i = 0;i < lessons.length;i++){
            let lesson = lessons[i];
            let studentSpans = this.buildStudentSpans(lesson.students);

            let date = new Date(lesson.date);
            let row = this.props.editable ? (
                <TableRow className="clickable" key={i} onClick={(e) => this.setSelectedLesson(lesson)}>
                    <TableCell component="th" scope="row">
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{lesson.lessonType}</TableCell>
                    <TableCell align="right">{lesson.notes}</TableCell>
                    <TableCell align="right">{studentSpans}</TableCell>
                    <TableCell align="right">{!lesson.teacher.fullName ? lesson.teacher.username : lesson.teacher.fullName}</TableCell>
                </TableRow>
            ) : 
            (
                <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{lesson.lessonType}</TableCell>
                    <TableCell align="right">{lesson.notes}</TableCell>
                    <TableCell align="right">{studentSpans}</TableCell>
                    <TableCell align="right">{!lesson.teacher.fullName ? lesson.teacher.username : lesson.teacher.fullName}</TableCell>
                </TableRow>
            );
            rows.push(
                row
            )
        }

        return(<TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell align="right">Lesson Type</TableCell>
                    <TableCell align="right">Notes</TableCell>
                    <TableCell align="right">Students</TableCell>
                    <TableCell align="right">Teacher</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
            </TableContainer>
        );
    }

    buildStudentTable = () =>{
        
    }

    render(){
        //console.log(this.state);
        let table = null;
        if(this.props.lessons && this.props.lessons.length > 0 && !this.props.studentLessons){
            table = this.buildTable(this.props.lessons);
        }
        else if(this.props.studentLessons && this.props.studentLessons.length > 0){
            table = this.buildTable(this.props.studentLessons);
        }
        return(
            <div>
                {table}
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});
export default (withRouter(connect(mapStateToProps)(LessonDisplay)));