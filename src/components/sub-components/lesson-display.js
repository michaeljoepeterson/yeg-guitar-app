import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter } from 'react-router-dom';
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

    buildTable = (lessons) =>{

        let rows = [];
        for(let i = 0;i < lessons.length;i++){
            let lesson = lessons[i];
            let studentString = '';
            for(let k = 0;k < lesson.students.length;k++){
                let student = lesson.students[k];
                studentString += student.firstName + ' ' + student.lastName;
                if(k !== lesson.students.length - 1){
                    studentString += ',';
                } 
            }
            let date = new Date(lesson.date);
            let row = this.props.editable ? (
                <TableRow className="clickable" key={i} onClick={(e) => this.setSelectedLesson(lesson)}>
                    <TableCell component="th" scope="row">
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{lesson.lessonType}</TableCell>
                    <TableCell align="right">{lesson.notes}</TableCell>
                    <TableCell align="right">{studentString}</TableCell>
                    <TableCell align="right">{lesson.teacher.username}</TableCell>
                </TableRow>
            ) : 
            (
                <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{lesson.lessonType}</TableCell>
                    <TableCell align="right">{lesson.notes}</TableCell>
                    <TableCell align="right">{studentString}</TableCell>
                    <TableCell align="right">{lesson.teacher.username}</TableCell>
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
        console.log('lesson display:',this.props.lessons);
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