import React, { useState,useEffect } from 'react';
import CheckPermission from '../../HOC/check-permission';
import {withRouter} from 'react-router-dom';
import {useSelector} from 'react-redux';
import LessonViewTable from '../sub-components/lesson-view-table';
import FilterControls from '../sub-components/filter-controls';
import StudentDetails from '../sub-components/student-details';
import Grid from '@material-ui/core/Grid';
import GetUrlFilters from '../../HOC/get-url-filters';
import useRequiresLogin from '../../hooks/use-requires-login';
import { useGetUsersQuery } from '../../store/api/users-api';
import { useLazySearchLessonsQuery } from '../../store/api/lesson-api';
import { CircularProgress } from '@material-ui/core';
import DownloadCsv from '../sub-components/download-csv';
import { lessonTableCsvConvert } from '../../utils/csv/lesson-table-csv-convert';

function StudentLessonPage(props){
    useRequiresLogin();
    const [student,setStudent] = useState(null);
    const [teacher,setTeacher] = useState(null);
    const [selectedDate,setSelectedDate] = useState(null);
    const [selectedStudent,setSelectedStudent] = useState(null);
    const [initialLoad,setInitialLoad] = useState(true);
    const {authToken, currentUser} = useSelector(state => state.auth);
    const {data: teachers} = useGetUsersQuery({authToken});
    const [triggerSearch, {data: lessons, isFetching: loadingLessons}] = useLazySearchLessonsQuery();
    const [csvFileName, setCsvFileName] = useState();

    useEffect(() => {
        if(teachers && teachers.length > 0 && props.teacher){
            //find teacher from pre populated teacher list
            //list populated by get teacher effect in filter controls
            let foundTeacher = teachers.find(teacher => teacher.username === props.teacher);
            setInitialLoad(false);
            setTeacher(foundTeacher);
        }
        else if(teachers && teachers.length > 0 && !props.teacher){
            setInitialLoad(false);
            setTeacher(null);
        }
    }, [teachers,props.teacher]);

    const teacherClicked = (teacher) =>{
        setTeacher(teacher); 
    }

    const updateSelectedStudent = (student) => {
        setSelectedStudent(student);
    }

    const studentClicked = (student) =>{
        setStudent(student);
        updateSelectedStudent(student);
    }

   const dateClicked = (date) =>{
        setSelectedDate(date);
    }

    const filterChanged = (newVal,changeType,changeData) =>{
        const studentTarget = 'fullName';
        const teacherChange = 'fullNameTeacher';

        if(changeData === studentTarget){
            setStudent(newVal);
        }
        else if(changeData === teacherChange){
            setTeacher(newVal);
        }
    }

    const onFiltersChanged = (options) => {
        const {startDate, endDate, selectedTeacher, selectedStudent} = options;
        let fileName = "";
        if(startDate){
            fileName += startDate.toDateString();
        }

        if(endDate){
            const endDateString = fileName !== "" ? `-${endDate.toDateString()}` : endDate.toDateString() ;
            fileName += endDateString;
        }

        if(selectedTeacher){
            const teacherString = fileName !== "" ? `${selectedTeacher.firstName + " " + selectedTeacher.lastName}`: selectedTeacher.firstName + " " + selectedTeacher.lastName;
            fileName += " Teacher - " + teacherString;
        }

        if(selectedStudent){
            const studentString = fileName !== "" ? `${selectedStudent.firstName + " " + selectedStudent.lastName}`: selectedStudent.firstName + " " + selectedStudent.lastName;
            fileName += " Student - " + studentString; 
        }

        triggerSearch({authToken, options}, true);
        setCsvFileName("Lessons - ", fileName);
    }

    const activeProp = 'active';


    return(
        <div>
            {!initialLoad && (
                    <FilterControls 
                        student={student} 
                        teacher={teacher} 
                        filterChanged={filterChanged} 
                        selectedDate={selectedDate} 
                        studentActive={activeProp} 
                        updateStudent={updateSelectedStudent} 
                        startDate={props.endDate} 
                        endDate={props.startDate}
                        onFiltersChanged={onFiltersChanged}
                    />
                )
            }
            <Grid container>
                <Grid item xs={12} className={!student ? 'hide' : ''}>
                    <StudentDetails student={selectedStudent}/>
                </Grid>
            </Grid>
            {
                (loadingLessons || !lessons) && <CircularProgress />
            }
            {!loadingLessons && lessons && 
                (
                    <div className="mt-4">
                        <div className="d-flex mb-4">
                            <DownloadCsv 
                                csvParser={lessonTableCsvConvert}
                                data={lessons}
                                fileName={csvFileName}
                            />
                        </div>
                        <LessonViewTable 
                            lessons={lessons}
                            studentClicked={studentClicked} 
                            teacherClicked={teacherClicked} 
                            dateClicked={dateClicked}
                        />
                    </div>
                )
            }
        </div>
    )
}

export default GetUrlFilters()(CheckPermission()(withRouter(StudentLessonPage)));