import React from "react";
import { Table, TableCell, TableHead, TableRow } from "@material-ui/core";

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
        </Table>
    );
}

export default LastLessonTable;