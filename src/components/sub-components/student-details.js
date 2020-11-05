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
import {updateStudentAsync,getStudents} from '../../actions/studentActions';

function StudentDetails(props){
    const [studentCopy,setStudentCopy] = useState(null);
    const [isLoading,setIsLoading] = useState(false);

    //const adminFields = ['firstName','lastName','active'];
    const adminFields = {
        firstName:{
            value:'firstName'
        },
        lastName:{
            value:'lastName'
        },
        active:{
            value:'active'
        }
    };
    const teacherFields = {
        notes:{
            value:'notes'
        }
    };

    const fieldChanged = (event,fieldName) => {
        event.persist();
        let value = fieldName !== adminFields.active.value ? event.target.value : event.target.checked;
        let newStudent = {...studentCopy};
        if(fieldName === adminFields.firstName.value){
            newStudent.firstName = value;
        }
        else if(fieldName === adminFields.lastName.value){
            newStudent.lastName = value;
        }
        else if(fieldName === adminFields.active.value){
            newStudent.active = value;
        }
        else if(fieldName === teacherFields.notes.value){
            newStudent.notes = value;
        }

        setStudentCopy(newStudent);
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
                                <TextField label="First Name" value={studentCopy.firstName} onChange={(e) => fieldChanged(e,adminFields.firstName.value)}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField label="Last Name" value={studentCopy.lastName} onChange={(e) => fieldChanged(e,adminFields.lastName.value)}/>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={studentCopy.active}
                                        onChange={(e) => fieldChanged(e,adminFields.active.value)}
                                        name="active"
                                        color="primary"
                                    />
                                    }
                                    label="Active"
                                />
                            </Grid>
                            <Grid item xs={12} >
                                <TextField className="notes-field" multiline label="Notes" rows="3" value={studentCopy.notes} onChange={(e) => fieldChanged(e,teacherFields.notes.value)}/>
                            </Grid>
                        </Grid>
                    );
                }
                else{
                    details = (
                        <Grid container>
                            <Grid item xs={12}>
                                <TextField className="notes-field" multiline label="Notes" rows="3" value={studentCopy.notes} onChange={(e) => fieldChanged(e,teacherFields.notes.value)}/>
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

    const updateStudent = async () => {
        setIsLoading(true);
        try{
            const resp = await updateStudentAsync(studentCopy,props.user.level);
            await props.dispatch(getStudents());
            setIsLoading(false);
        }
        catch(e){
            setIsLoading(false);
            console.log('error updating student: ',e);
        }
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
        else{
            setStudentCopy(null);
        }
    },[props.student]);

    const studentDetails = buildStudentDetails();
    const updateButton = studentCopy ? (<Button  variant="contained" onClick={(e) => updateStudent()} disabled={isLoading}>Update</Button>) : null;
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