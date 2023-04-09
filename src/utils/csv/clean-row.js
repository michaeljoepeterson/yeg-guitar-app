export const cleanCsvRow = (row) => {
    return row.map(col => typeof col !== "string" ? col : `"${col.replace(/"/g, '""')}"`);
};
