import React, { useState,useEffect } from 'react';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {useSelector} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Button from '@material-ui/core/Button';
import {updateStudentAsync,getStudents} from '../../actions/studentActions';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import './styles/student-details.css'
import { useGetCategoriesQuery } from '../../store/api/categories-api';
import { useMemo } from 'react';
import { useUpdateStudentMutation } from '../../store/api/student-api';

function StudentDetails(props){
    const [studentCopy,setStudentCopy] = useState(null);
    const [isExpanded,setIsExpanded] = useState(false);
    const {authToken, currentUser} = useSelector(state => state.auth);
    const user = useMemo(() => currentUser, [currentUser]);
    const {data: categories} = useGetCategoriesQuery({authToken});
    const [updateStudentMutation, {isLoading}] = useUpdateStudentMutation()

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
    //to do extract category select into component
    const categoryChanged = (event,index) =>{
        event.persist();
        let value = event.target.value;
        let student = {...studentCopy};
        //debugger;
        let foundCategory = categories.find(cat => value === cat.id);
        student.category = student.category.map((cat,i) => {
            if(i === index){
                return foundCategory;
            }
            else {
                return cat
            }
        });

        setStudentCopy(student);
    }

    const removeCategory = (index) => {
        let student = {...studentCopy};
        student.category = student.category.filter((cat,i) => i !== index);

        setStudentCopy(student);
    }

    const addCategory = () => {
        let student = {...studentCopy};
        student.category.push({});

        setStudentCopy(student);
    }

    const buildStudentDetails = () => {
        if(!user){
            return null;
        }
        const userLevel = user.level;
        let details = null;
        try{
            if(studentCopy){
                if(userLevel <= 1){
                    let categoryItems = [];

                    for(let i = 0;i < categories.length;i++){
                        const item = categories[i];
                        categoryItems.push(
                            <MenuItem value={item.id} key={i}>{item.name}</MenuItem>
                        );
                    }

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
                            <Grid item xs={6} >
                                <TextField className="student-notes-field" multiline label="Notes" rows="13" value={studentCopy.notes} onChange={(e) => fieldChanged(e,teacherFields.notes.value)}/>
                            </Grid>
                            <Grid item container xs={6} >
                                <Grid item xs={12}>
                                    <InputLabel className="student-label" id="categories">Categories</InputLabel>
                                    <IconButton aria-label="add category" onClick={(e) => addCategory()}>
                                    <AddCircleOutlinedIcon />
                            </IconButton>
                                </Grid>
                                {studentCopy.category.map((cat,i) => {
                                    return (<Grid className="student-row" item xs={12} md={3} key={i + cat.id}>
                                        <Select onChange={(e) => categoryChanged(e,i)} value={cat.id} >{categoryItems}</Select>
                                        <IconButton onClick={(e) => removeCategory(i)} aria-label="remove student">
                                            <CancelOutlinedIcon/>
                                        </IconButton>
                                    </Grid>)
                                })}
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
        try{
            updateStudentMutation({ authToken, student: studentCopy, level: user.level});
            //const resp = await updateStudentAsync(studentCopy, user.level);
            //await props.dispatch(getStudents());
        }
        catch(e){
            console.log('error updating student: ',e);
        }
    }

    const handleExpanded = (event) => {
        const currExpanded = isExpanded ? false : true;
        setIsExpanded(currExpanded);
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
        if(props.student && props.student.firstName){
            setIsExpanded(true);
        }
        else{
            setIsExpanded(false);
        }
    },[props.student]);

    const studentDetails = buildStudentDetails();
    const updateButton = studentCopy ? (<Button  variant="contained" onClick={(e) => updateStudent()} disabled={isLoading}>Update</Button>) : null;

    return(
        <div>
            <Accordion expanded={isExpanded} onChange={(e)=> handleExpanded(e)}>
                {studentSummary}
                <AccordionDetails style={{flexDirection: "column"}} >
                    {studentDetails}
                    <div>
                        {updateButton}
                    </div>
                </AccordionDetails>
            </Accordion>
        </div>
    )
}


export default StudentDetails;