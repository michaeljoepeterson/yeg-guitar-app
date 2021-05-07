import React, {useState} from 'react';
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
import { Lesson } from '../../models/lesson';

import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import TablePagination from '@material-ui/core/TablePagination';
import {Pager} from '../../helpers/pager';
import './styles/table-styles.css';

export function LessonViewTable(props){

    const [hoveredRow,setHoveredRow] = useState(null);
    const [page, setPage] = useState(0);
    const [resultNum, setresultNum] = useState(30);
    const pager = new Pager({
        items:props.lessons.sort((a,b) => {
            let dateA = new Date(a.date);
            let dateB = new Date(b.date);
            if(dateA < dateB){
                return 1;
            }
            else{
                return -1;
            }
        }),
        resultPerPage:resultNum
    });
    const rowsPerPage = [10,20,30,50,70,100];
    const visisbleLessons = pager.getPage(page);

    const setLesson = (lesson) => {
        if(props.user.level <= 1 || (props.user.id === lesson.teacher.id)){
            console.log('selected lesson: ',lesson);
            props.dispatch(setSelectedLesson(lesson));
            props.history.push(`/edit-lesson/${lesson.id}`);
        }
    };

    const studentClicked = (student) => {
        console.log('student clicked: ',student);
        if(props.studentClicked){
            props.studentClicked(student);
        }
    };

    const buildStudentSpans = (students) =>{
        let spans = students.map((student,i) => {
            return (<span onClick={(e) => studentClicked(student)} key={student.firstName + i}>{student.firstName + ' ' + student.lastName}{i === students.length - 1 ? '' : ','}</span>);
        });

        return spans;
    };

    const dateClicked = (date) =>{
        console.log('date clicked',date);
        
        if(props.dateClicked){
            props.dateClicked(date);
        }
    };

    const teacherClicked = (teacher) =>{
        console.log('teacher clicked',teacher);
        if(props.teacherClicked){
            props.teacherClicked(teacher);
        }
    };
    /*
    const enterRow = (row) => {
        console.log('row entered');
        setHoveredRow(row);
    };

    const exitRow = () => {
        setHoveredRow(null);
    };
    */
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setresultNum(parseInt(event.target.value, 10));
        setPage(0);
    };

    const buildTable = (passedLessons) =>{
        let lessons = passedLessons.map(lesson => new Lesson(lesson));
        let rows = [];
        for(let i = 0;i < lessons.length;i++){
            let lesson = lessons[i];
            let studentSpans = buildStudentSpans(lesson.students);

            let date = new Date(lesson.date);
            let classes = "clickable";
            if(i === hoveredRow){
                classes += ' hovered';
            }
            let row =  (
                <TableRow className={classes} key={lesson.notes + i}>
                    <TableCell component="th" scope="row" onClick={(e)=> dateClicked(date)}>
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{lesson.lessonType}</TableCell>
                    {/* <TableCell onClick={(e) => setLesson(lesson)}>{lesson.notes}</TableCell> */}
                    <TableCell onClick={(e) => setLesson(lesson)}>
                        <div className="notes">
                            <CKEditor
                                editor={ ClassicEditor }
                                data={lesson.notes}
                                disabled={true}
                                config={{
                                    toolbar:[]
                                }}
                            />
                        </div>
                    </TableCell>
                    <TableCell>{studentSpans}</TableCell>
                    <TableCell onClick={(e) => teacherClicked(lesson.teacher)}>{!lesson.teacher.fullName ? lesson.teacher.username : lesson.teacher.fullName}</TableCell>
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
                        <TableCell>Lesson Type</TableCell>
                        <TableCell>Notes</TableCell>
                        <TableCell>Students</TableCell>
                        <TableCell>Teacher</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {rows}
                    </TableBody>
                </Table>
                <TablePagination
                    component="div"
                    count={props.lessons.length}
                    page={page}
                    onChangePage={handleChangePage}
                    rowsPerPage={resultNum}
                    rowsPerPageOptions={rowsPerPage}
                    onChangeRowsPerPage={handleChangeRowsPerPage}
                    />
            </TableContainer>
        );
    }
    let table = null;
    if(props.lessons && props.lessons.length > 0){
        table = buildTable(visisbleLessons);
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