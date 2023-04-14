import React, { useCallback, useState } from "react";
import { useSelector } from "react-redux";
import useCheckPermission from "../../../hooks/use-check-permission";
import useRequiresLogin from "../../../hooks/use-requires-login";
import { useLazyGetStudentLastLessonQuery } from "../../../store/api/lesson-api";
import { lastLessonTableCsvConvert } from "../../../utils/csv/last-lesson-table-csv-convert";
import DownloadCsv from "../../sub-components/download-csv";
import DateControls from "./components/date-controls";
import LastLessonTable from "./components/last-lesson-table";
import { CircularProgress } from "@material-ui/core";

export const StudentLastLessonPage = () => {
    const {loading} = useRequiresLogin();
    const [csvName, setCsvName] = useState();
    const {loading: permissionLoading} = useCheckPermission(2);
    const {currentUser, authToken} = useSelector((state) => state.auth);
    const [trigger, {data, isFetching: loadingLessons}] = useLazyGetStudentLastLessonQuery();

    const createCsvName = (startDate, endDate) => {
        let fileName = "Last Lesson - ";
        if(startDate){
            fileName += startDate.toDateString();
        }

        if(endDate){
            const endDateString = fileName !== "" ? `-${endDate.toDateString()}` : endDate.toDateString() ;
            fileName += endDateString;
        }

        setCsvName(fileName);
    }

    const dateUpdated = useCallback((startDate, endDate) => {
        if(currentUser && authToken){
            trigger({
                authToken,
                level: currentUser.level,
                startDate,
                endDate
            }, true);
            createCsvName(startDate, endDate);
        }
    }, [trigger, currentUser, authToken]);

    if(loading || permissionLoading){
        return null;
    }

    return (
        <div>
            <h1>
                Last Lesson Page
            </h1>
            <DateControls
                dateUpdated={dateUpdated}
            />
            <div className="d-flex mb-4">
                <DownloadCsv
                    csvParser={lastLessonTableCsvConvert}
                    data={data?.lessons ? data.lessons : []}
                    fileName={csvName}
                />
            </div>
            {loadingLessons && <CircularProgress />}
            {
                !loadingLessons && <LastLessonTable data={data?.lessons}/> 
            }
        </div>
    )
}

export default StudentLastLessonPage;