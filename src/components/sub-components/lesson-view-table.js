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


export function LessonViewTable(props){



    const setLesson = (lesson) => {
        if(props.user.level <= 1 || (props.user.id === lesson.teacher.id)){
            console.log('selected lesson: ',lesson);
            props.dispatch(setSelectedLesson(lesson));
            props.history.push(`/edit-lesson/${lesson.id}`);
        }
    }

    const studentClicked = (student) => {
        console.log('student clicked: ',student);
        if(props.studentClicked){
            props.studentClicked(student);
        }
    }

    const buildStudentSpans = (students) =>{
        let spans = students.map((student,i) => {
            return (<span onClick={(e) => studentClicked(student)} key={student.firstName + i}>{student.firstName + ' ' + student.lastName}{i === students.length - 1 ? '' : ','}</span>);
        });

        return spans;
    }

    const dateClicked = (date) =>{
        console.log('date clicked',date);
        
        if(props.dateClicked){
            props.dateClicked(date);
        }
    }

    const teacherClicked = (teacher) =>{
        console.log('teacher clicked',teacher);
        if(props.teacherClicked){
            props.teacherClicked(teacher);
        }
    }

    const buildTable = (lessons) =>{
        lessons = lessons.sort((a,b) => {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            if(dateA < dateB){
                return 1;
            }
            else{
                return -1;
            }
        })
        let rows = [];
        for(let i = 0;i < lessons.length;i++){
            let lesson = lessons[i];
            let studentSpans = buildStudentSpans(lesson.students);

            let date = new Date(lesson.date);
            let row =  (
                <TableRow className="clickable" key={lesson.notes + i}>
                    <TableCell component="th" scope="row" onClick={(e)=> dateClicked(date)}>
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{lesson.lessonType}</TableCell>
                    <TableCell align="right" onClick={(e) => setLesson(lesson)}>{lesson.notes}</TableCell>
                    <TableCell align="right">{studentSpans}</TableCell>
                    <TableCell align="right" onClick={(e) => teacherClicked(lesson.teacher)}>{!lesson.teacher.fullName ? lesson.teacher.username : lesson.teacher.fullName}</TableCell>
                </TableRow>
            );
            rows.push(
                row
            );
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
    let table = null;
    if(props.lessons && props.lessons.length > 0){
        table = buildTable(props.lessons);
    }

    return(
        <div>
            {table}
        </div>
    )
}

const mapStateToProps = state => ({
    lessons:state.lessons.lessons,
    user: state.auth.currentUser
});
export default (withRouter(connect(mapStateToProps)(LessonViewTable)));