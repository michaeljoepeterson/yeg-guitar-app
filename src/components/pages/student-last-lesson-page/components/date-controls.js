import React, { useCallback, useEffect, useMemo, useState } from "react";
import DatePicker from "../../../sub-components/date-picker";

export const DateControls = ({dateUpdated}) => {
    const initialStartDate = useMemo(() => {
        const date = new Date();
        date.setDate(date.getMonth() - 1);
        return date;
    }, []);

    const [startDate, setStartDate] = useState(initialStartDate);
    const [endDate, setEndDate] = useState(new Date());

    useEffect(() => {
        dateUpdated(startDate, endDate);
    }, [startDate, endDate]);

    const startDateUpdated = useCallback((date) => {
        setStartDate(new Date(date));
    }, [setStartDate]);

    const endDateUpdated = useCallback((date) => {
        setEndDate(new Date(date));
    }, [setStartDate]);

    return (
        <div className="date-controls">
            <DatePicker
                label="Start date"
                dateVal={startDate}
                dateUpdated={startDateUpdated}
            />
            <DatePicker
                label="End date"
                dateVal={endDate}
                dateUpdated={endDateUpdated}
            />
        </div>
    )
}

export default DateControls;
