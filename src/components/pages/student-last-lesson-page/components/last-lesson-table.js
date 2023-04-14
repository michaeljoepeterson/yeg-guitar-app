import React, { useCallback, useMemo, useState } from "react";
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow } from "@material-ui/core";
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import { Pager } from "../../../../helpers/pager";
import LessonDescription from "../../../sub-components/tables/lesson-description";

export const LastLessonTable = ({data}) => {
    //could probably setup a pager component
    const [page, setPage] = useState(0);
    const [sortMethod, setSortMethod] = useState();
    const [sortDirection, setSortDirection] = useState(true);
    const [resultNum, setresultNum] = useState(30);
    const rowsPerPage = [10, 20, 30, 50, 70, 100];
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

    const pager = useMemo(() => {
        const lessons = sortedLessons ? [...sortedLessons] : [];
        const p = new Pager({
            items: lessons.sort((a,b) => {
                let dateA = new Date(a.date);
                let dateB = new Date(b.date);
                if(dateA < dateB){
                    return 1;
                }
                else{
                    return -1;
                }
            }),
            resultPerPage: resultNum
        });

        return p
    }, [sortedLessons, resultNum]);

    const visibleLessons = useMemo(() => {
        return pager.getPage(page);
    }, [pager, page])

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

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setresultNum(parseInt(event.target.value, 10));
        setPage(0);
    };


    return (
        <TableContainer component={Paper}>
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
                        visibleLessons && visibleLessons.map((userLesson, i) => {
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
                                        <LessonDescription 
                                            notes={notes}
                                            id={latestLesson._id}
                                        />
                                    </TableCell>
                                </TableRow>
                            )
                        })
                    }
                </TableBody>
            </Table>
            <TablePagination
                component="div"
                count={sortedLessons.length}
                page={page}
                rowsPerPage={resultNum}
                rowsPerPageOptions={rowsPerPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
}

export default LastLessonTable;