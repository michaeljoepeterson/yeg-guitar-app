import React from "react";
import useCheckPermission from "../../../hooks/use-check-permission";
import useRequiresLogin from "../../../hooks/use-requires-login";
import LastLessonTable from "./components/last-lesson-table";

export const StudentLastLessonPage = () => {
    const {loading} = useRequiresLogin();
    const {loading: permissionLoading} = useCheckPermission(1);

    if(loading || permissionLoading){
        return null;
    }

    return (
        <div>
            Last Lesson Page
            <LastLessonTable />
        </div>
    )
}

export default StudentLastLessonPage;