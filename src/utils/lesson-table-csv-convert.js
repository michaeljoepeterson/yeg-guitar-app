export const lessonTableCsvConvert = (data) => {
    let csvData = [["Date", "Lesson Type", "Notes", "Students", "Teacher"]];
    data.forEach(lesson => {
        const {date, lessonType, notes, students, teacher} = lesson;
        const lessonDate = new Date(date);
        const dateString = `${lessonDate.toLocaleDateString()} ${lessonDate.toLocaleTimeString()}`;
        const studentNames = students.map(student => `${student.firstName} ${student.lastName}`).join(", ");
        const teacherName = `${teacher.firstName} ${teacher.lastName}`;
        const row = [dateString, lessonType, notes, studentNames, teacherName];
        csvData.push(row);
    });
    let csv = "data:text/csv;charset=utf-8,";
    csvData = csvData.map(row => cleanCsvRow(row));
    csv += csvData.map(row => row.join(",")).join("\n");
    return csv;
};

const cleanCsvRow = (row) => {
    return row.map(col => typeof col !== "string" ? col : `"${col.replace(/"/g, '""')}"`);
};
