import { cleanCsvRow } from "./clean-row";

export const lastLessonTableCsvConvert = (data) => {
    let csvData = [["Student", "Date", "Teacher" ,"Lesson Type", "Notes"]];
    data.forEach(lessonData => {
        const {firstName, lastName, lesson} = lessonData;
        const l = lesson.length > 0 ? lesson[0] : {};
        const {date, teacher, lessonType, notes} = l;
        const dateString = date ? new Date(date).toLocaleDateString() : "No Recent Lesson";
        const teacherString = teacher && teacher.length > 0 ? `${teacher[0].firstName} ${teacher[0].lastName}` : "No Recent Lesson";
        const lessonTypeString = lessonType ? lessonType : "No Recent Lesson";
        const notesString = notes ? notes : "No Recent Lesson";
        const row = [`${firstName} ${lastName}`, dateString, teacherString, lessonTypeString, notesString];
        csvData.push(row);
    });
    let csv = "data:text/csv;charset=utf-8,";
    csvData = csvData.map(row => cleanCsvRow(row));
    csv += csvData.map(row => row.join(",")).join("\n");
    console.log(data);
    console.log(csv);
    return csv;
}
