import React, { useCallback, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import parse from 'html-react-parser';

export const LastLessonTable = ({data}) => {
    const [sortMethod, setSortMethod] = useState();
    const [sortDirection, setSortDirection] = useState(true);
    const sortedLessons = useMemo(() => {
        const lessonData = data ? [...data] : [];
        if(sortMethod === 'student'){
            return lessonData.sort((studentLessonA, studentLessonB) => {
                if(studentLessonA.firstName < studentLessonB.firstName){
                    return sortDirection ? -1 : 1;
                }
                else{
                    return sortDirection ? 1 : -1;
                }
            });
        }

        return lessonData;
    }, [data, sortMethod, sortDirection]);

    const sortStudents = useCallback(() => {
        console.log('sort students', sortDirection, sortMethod);
        if(sortMethod === 'student'){
            setSortDirection(!sortDirection);
        }
        else{
            setSortMethod('student');
        }
    }, [setSortDirection, setSortMethod, sortDirection, sortMethod]);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell className="clickable" onClick={sortStudents}>Student</TableCell>
                    <TableCell>Date</TableCell>
                    <TableCell>Teacher</TableCell>
                    <TableCell>Lesson Type</TableCell>
                    <TableCell>Notes</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    sortedLessons && sortedLessons.map((userLesson, i) => {
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