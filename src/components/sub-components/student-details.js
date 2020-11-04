import React, { useState,useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';

function StudentDetails(props){
    const [studentCopy,setStudentCopy] = useState(null);

    const adminFields = ['firstName','lastName','active'];
    const teacherFields = ['notes'];

    const fieldChanged = (event,fieldName) => {
        event.persist();
        let value = event.target.value;

        console.log('field changed')
    }

    const buildStudentDetails = () => {
        const userLevel = props.user.level;
        let details = null;
        try{
            if(studentCopy){
                if(userLevel <= 1){
                    details = (
                        <Grid container>
                            <Grid item xs={12} sm={4}>
                                <TextField label="First Name" value={studentCopy.firstName} onChange={(e) => fieldChanged(e,adminFields[0])}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Last Name" value={studentCopy.lastName} onChange={(e) => fieldChanged(e,adminFields[1])}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={studentCopy.active}
                                        onChange={(e) => fieldChanged(e,adminFields[2])}
                                        name="active"
                                        color="primary"
                                    />
                                    }
                                    label="Active"
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField className="notes-field" multiline label="Notes" rows="3" value={studentCopy.notes} onChange={(e) => fieldChanged(e,adminFields[1])}/>
                            </Grid>
                        </Grid>
                    );
                }
                else{
                    details = (
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField className="notes-field" multiline label="Notes" rows="3" value={studentCopy.notes} onChange={(e) => fieldChanged(e,adminFields[1])}/>
                            </Grid>
                        </Grid>
                    );
                }
            }
        }
        catch(e){
            console.warn('error building student details',e);
        }

        return details;
    }

    const updateStudent = () => {

    }
    

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

    useEffect(() => {
        let copy = {...props.student};
        if(copy.id){
            setStudentCopy(copy);
        }
    },[props.student]);

    const studentDetails = buildStudentDetails();
    const updateButton = studentCopy ? (<Button  variant="contained" onClick={(e) => updateStudent()}>Update</Button>) : null;
    return(
        <div>
            <Accordion>
                {studentSummary}
                <AccordionDetails style={{flexDirection: "column"}}>
                    {studentDetails}
                    <div>
                        {updateButton}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}

const mapStateToProps = state => ({
    user: state.auth.currentUser,
});

export default connect(mapStateToProps)(StudentDetails);