import React from 'react';
import Grid from '@material-ui/core/Grid';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import './styles/user-list.css';

export default function SummaryView(props){

    const buildDataTable = () =>{
        let rows = [];
        for(let key in props.data.hours){
            let row = (
                <TableRow key={key}>
                    <TableCell align="center">{ '$' + key + '.00'}</TableCell>
                    <TableCell align="center">{props.data.hours[key]}</TableCell>
                </TableRow>
            )
            rows.push(
                row
            )
        }

        return(
        <TableContainer component={Paper}>
            <Table aria-label="simple table">
                <TableHead>
                <TableRow>
                    <TableCell align="center">Rate</TableCell>
                    <TableCell align="center">Number of Lessons</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {rows}
                </TableBody>
            </Table>
        </TableContainer>
        );
    }
    let hourTable = props.data && props.data.hours ? buildDataTable() : null;
    return(
        <Grid container>
            <Grid item sm={6} xs={12}>
                <p>Total Classes: {props.data.totalHours ? props.data.totalHours  : 0}</p>
            </Grid>
            <Grid item sm={6} xs={12}>
                <p>Total Students: {props.data.totalStudents ? props.data.totalStudents  : 0}</p>
            </Grid>
            <Grid className='hours-table' item xs={12}>
                {hourTable}
            </Grid>
        </Grid>
    )
}
