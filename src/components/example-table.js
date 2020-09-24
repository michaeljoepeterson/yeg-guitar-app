import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import {getLessons} from '../actions/lessonActions';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LessonDisplay from './sub-components/lesson-display';


export class ExampleTable extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    componentDidMount(){
        this.props.dispatch(getLessons())
    }

    buildTable = () =>{

        let rows = [];
        for(let i = 0;i < this.props.lessons.length;i++){
            let lesson = this.props.lessons[i];
            let studentString = '';
            for(let k = 0;k < lesson.students.length;k++){
                let student = lesson.students[k];
                studentString += student.firstName + ' ' + student.lastName;
                if(k !== lesson.students.length - 1){
                    studentString += ',';
                } 
            }
            let date = new Date(lesson.date);
            rows.push(
                <TableRow key={i}>
                    <TableCell component="th" scope="row">
                        {date.toDateString() + ' : ' + date.toLocaleTimeString()}
                    </TableCell>
                    <TableCell align="right">{lesson.lessonType}</TableCell>
                    <TableCell align="right">{lesson.notes}</TableCell>
                    <TableCell align="right">{studentString}</TableCell>
                    <TableCell align="right">{lesson.teacher.email}</TableCell>
                </TableRow>
            )
        }

        return(<TableContainer component={Paper}>
            <Table  aria-label="simple table">
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

    render(){
        //console.log(this.state);
        console.log('example table:',this.props.lessons);
        const table = this.props.lessons && this.props.lessons.length > 0? this.buildTable() : []; 
        return(
            <div>
                <LessonDisplay />
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessons:state.lessons.lessons
});
export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(ExampleTable))));