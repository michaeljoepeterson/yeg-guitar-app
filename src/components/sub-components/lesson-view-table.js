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
import {setSelectedLesson,deleteLesson} from '../../actions/lessonActions';
import { Lesson } from '../../models/lesson';
import TablePagination from '@material-ui/core/TablePagination';
import {Pager} from '../../helpers/pager';
import './styles/table-styles.css';
import parse from 'html-react-parser';
import IconButton from '@material-ui/core/IconButton';
import Delete from '@material-ui/icons/Delete';
import SimpleModal from './simple-modal';

export function LessonViewTable(props){

    const [page, setPage] = useState(0);
    const [resultNum, setresultNum] = useState(30);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [deleteLessonId, setDeleteLessonId] = useState(null);
    const [deleteMessage, setDeleteMessage] = useState('');
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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setresultNum(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDeleteLesson = async () => {
        try{
            props.dispatch(deleteLesson(deleteLessonId,props.user.level));
        }
        catch(e){
            console.warn(e);
        }
        setDeleteModalOpen(false);
        setDeleteLessonId(null);
        setDeleteMessage('');
    }

    const handleCloseDelete = async () => {
        setDeleteModalOpen(false);
        setDeleteLessonId(null);
        setDeleteMessage('');
    }

    const openDeleteModal = async (event,lesson) => {
        let {id,date} = lesson;
        let lessonDate = new Date(date);
        event.stopPropagation();
        console.log(lesson);
        setDeleteModalOpen(true);
        setDeleteLessonId(id);
        setDeleteMessage(`Are you sure you want to delete ${lesson.teacher.fullName}'s lesson from ${lessonDate.toDateString()}`);
    }

    const buildTable = (passedLessons) =>{
        let lessons = passedLessons.map(lesson => new Lesson(lesson));
        let rows = [];
        for(let i = 0;i < lessons.length;i++){
            let lesson = lessons[i];
            let studentSpans = buildStudentSpans(lesson.students);

            let date = new Date(lesson.date);
            let classes = "clickable";
     
            let row =  (
                <TableRow className={classes} key={lesson.notes + i}>
                    <TableCell component="th" scope="row" onClick={(e)=> dateClicked(date)}>
                        {
                            props?.user?.level <= 1 ? (                        <IconButton onClick={(e) => openDeleteModal(e,lesson)} color="secondary" aria-label="delete" size="large">
                                <Delete />
                            </IconButton>) : null
                        }
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell>{lesson.lessonType}</TableCell>
                    {/* <TableCell onClick={(e) => setLesson(lesson)}>{lesson.notes}</TableCell> */}
                    <TableCell onClick={(e) => setLesson(lesson)}>
                        <div className="notes">
                            {parse(lesson.notes)}
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
            <SimpleModal open={deleteModalOpen} message={deleteMessage} submitClick={handleDeleteLesson} handleClose={handleCloseDelete} color={"secondary"} submit={"Delete"}/>
        </div>
    )
}

const mapStateToProps = state => ({
    lessons:state.lessons.lessons,
    user: state.auth.currentUser
});
export default (withRouter(connect(mapStateToProps)(LessonViewTable)));