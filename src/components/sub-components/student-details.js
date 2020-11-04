import React, { useState  } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

function StudentDetails(props){

    const studentSummary = props.student ? (
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="student-panel"
        >
          <p>{props.student.fullName}</p>
        </AccordionSummary>
    ) : (<AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="student-panel"
        id="panel1a-header"
      >
        <p>No Student Selected</p>
      </AccordionSummary>);

    return(
        <div>
            <Accordion>
                {studentSummary}
            </Accordion>
        </div>
    )
}

export default StudentDetails;