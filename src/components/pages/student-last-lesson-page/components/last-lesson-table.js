import React, { useCallback, useMemo, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@material-ui/core";
import parse from 'html-react-parser';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';

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
        else if(sortMethod === 'date'){
            return lessonData.sort((studentLessonA, studentLessonB) => {
                const lessonDateA = studentLessonA.lesson[0]?.date;
                const lessonDateB = studentLessonB.lesson[0]?.date;
                if(!lessonDateA){
                    return sortDirection ? 1 : -1; 
                }
                if(!lessonDateB){
                    return sortDirection ? -1 : 1;
                }
                if(lessonDateA< lessonDateB){
                    return sortDirection ? -1 : 1;
                }
                else{
                    return sortDirection ? 1 : -1;
                }
            });
        }
        else if(sortMethod === 'teacher'){
            return lessonData.sort((studentLessonA, studentLessonB) => {
                const teacherA = studentLessonA.lesson[0]?.teacher[0]?.firstName;
                const teacherB = studentLessonB.lesson[0]?.teacher[0]?.firstName;
                if(!teacherA){
                    return sortDirection ? 1 : -1; 
                }
                if(!teacherB){
                    return sortDirection ? -1 : 1;
                }
                if(teacherA< teacherB){
                    return sortDirection ? -1 : 1;
                }
                else{
                    return sortDirection ? 1 : -1;
                }
            });
        }
        else if(sortMethod === 'lesson-type'){
            return lessonData.sort((studentLessonA, studentLessonB) => {
                const lessonTypeA = studentLessonA.lesson[0]?.lessonType;
                const lessonTypeB = studentLessonB.lesson[0]?.lessonType;
                if(!lessonTypeA){
                    return sortDirection ? 1 : -1; 
                }
                if(!lessonTypeB){
                    return sortDirection ? -1 : 1;
                }
                if(lessonTypeA< lessonTypeB){
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
        if(sortMethod === 'student'){
            setSortDirection(!sortDirection);
        }
        else{
            setSortMethod('student');
        }
    }, [setSortDirection, setSortMethod, sortDirection, sortMethod]);

    const sortDate = useCallback(() => {
        if(sortMethod === 'date'){
            setSortDirection(!sortDirection);
        }
        else{
            setSortMethod('date');
        }
    }, [setSortDirection, setSortMethod, sortDirection, sortMethod]);

    const sortTeacher = useCallback(() => {
        if(sortMethod === 'teacher'){
            setSortDirection(!sortDirection);
        }
        else{
            setSortMethod('teacher');
        }
    }, [setSortDirection, setSortMethod, sortDirection, sortMethod]);

    const sortLessonType = useCallback(() => {
        if(sortMethod === 'lesson-type'){
            setSortDirection(!sortDirection);
        }
        else{
            setSortMethod('lesson-type');
        }
    }, [setSortDirection, setSortMethod, sortDirection, sortMethod]);

    const sortIcon = useMemo(() => {
        return sortDirection ? (<KeyboardArrowDownIcon />) : (<KeyboardArrowUpIcon />);
    }, [sortDirection]);

    return (
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell className="clickable" onClick={sortStudents}>
                        <div>
                            <span className={sortMethod === 'student' ? '' : 'visible-hidden'}>
                                {sortIcon}
                            </span>
                            Student
                        </div>
                    </TableCell>
                    <TableCell className="clickable" onClick={sortDate}>
                        <div>
                            <span className={sortMethod === 'date' ? '' : 'visible-hidden'}>
                                {sortIcon}
                            </span>
                            Date
                        </div>
                    </TableCell>
                    <TableCell className="clickable" onClick={sortTeacher}>
                        <div>
                            <span className={sortMethod === 'teacher' ? '' : 'visible-hidden'}>
                                {sortIcon}
                            </span>
                            Teacher
                        </div>
                    </TableCell>
                    <TableCell className="clickable" onClick={sortLessonType}>
                        <div>
                            <span className={sortMethod === 'lesson-type' ? '' : 'visible-hidden'}>
                                {sortIcon}
                            </span>
                            Lesson Type
                        </div>
                    </TableCell>
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