import React, { useCallback } from "react";
import { useSelector } from "react-redux";
import useCheckPermission from "../../../hooks/use-check-permission";
import useRequiresLogin from "../../../hooks/use-requires-login";
import { useLazyGetStudentLastLessonQuery } from "../../../store/api/lesson-api";
import DateControls from "./components/date-controls";
import LastLessonTable from "./components/last-lesson-table";

export const StudentLastLessonPage = () => {
    const {loading} = useRequiresLogin();
    const {loading: permissionLoading} = useCheckPermission(1);
    const {currentUser, authToken} = useSelector((state) => state.auth);
    const [trigger, {data}] = useLazyGetStudentLastLessonQuery();

    const dateUpdated = useCallback((startDate, endDate) => {
        console.log(startDate, endDate);
        if(currentUser && authToken){
            trigger({
                authToken,
                level: currentUser.level,
                startDate,
                endDate
            }, true);
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
            <LastLessonTable 
                data={data?.lessons}
            />
        </div>
    )
}

export default StudentLastLessonPage;