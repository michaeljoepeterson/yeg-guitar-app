import React from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import parse from 'html-react-parser';

export const LastLessonTable = ({data}) => {
    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell>Student</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Teacher</TableCell>
                    <TableCell>Lesson Type</TableCell>
                    <TableCell>Notes</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    data && data.map((userLesson, i) => {
                        const {lesson} = userLesson;
                        const key = `${userLesson.firstName}_${userLesson.lastName}_${i}`;
                        if(lesson.length === 0){
                            return (
                                <TableRow key={key}>
                                    <TableCell>{`${userLesson.firstName} ${userLesson.lastName}`}</TableCell>
                                    <TableCell>No Recent Lesson</TableCell>
                                    <TableCell>No Recent Lesson</TableCell>
                                    <TableCell>No Recent Lesson</TableCell>
                                    <TableCell>No Recent Lesson</TableCell>
                                </TableRow>
                            )
                        }
                        const latestLesson = lesson[0];
                        const {lessonType, notes} = latestLesson;
                        const teacher = latestLesson.teacher[0];
                        const date = new Date(latestLesson.date);
                        return (
                            <TableRow key={key}>
                                <TableCell>{`${userLesson.firstName} ${userLesson.lastName}`}</TableCell>
                                <TableCell>{date.toDateString()}</TableCell>
                                <TableCell>{teacher.fullName}</TableCell>
                                <TableCell>{lessonType}</TableCell>
                                <TableCell>
                                    <div className="notes">
                                        {parse(notes)}
                                    </div>
                                </TableCell>
                            </TableRow>
                        )
                    })
                }
            </TableBody>
        </Table>
    );
}

export default LastLessonTable;