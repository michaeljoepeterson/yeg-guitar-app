import { Button } from "@material-ui/core";
import React, { useCallback, useEffect, useRef, useState } from "react";

export const DownloadCsv = ({
    title = "Download CSV",
    csvParser,
    data,
    fileName = "data.csv"
}) => {
    const [csv, setCsv] = useState();
    const ref = useRef();

    useEffect(() => {
        if(ref.current && csv){
            ref.current.click();
            setCsv(null);
        }
    }, [ref, ref.current, csv]);

    const handleClick = useCallback(() => {
        const csvString = csvParser(data);
        setCsv(csvString);
    }, [csvParser, data, setCsv]);

    return (
        <>
            <Button 
                onClick={handleClick}
                variant="contained"
            >
                {title}
            </Button>
            <a ref={ref} className="d-hidden" href={csv} download={fileName.includes('.csv') ? fileName : fileName += '.csv'}></a>
        </>
    );
}

export default DownloadCsv;