import React, {useState} from 'react';
import requiresLogin from '../../HOC/requires-login';
import CheckPermission from '../../HOC/check-permission';
import {useSelector} from 'react-redux';
import { withRouter} from 'react-router-dom';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SnackbarWrapper from '../snackbar-wrapper';
import Typography from '@material-ui/core/Typography';
import { LessonType } from '../../models/lesson-type';

import '../styles/create-lesson.css';
import { useCreateTypeMutation } from '../../store/api/lesson-types-api';
import { useEffect } from 'react';

function CreateType(props){
    const [type,setType] = useState(new LessonType());
    const {currentUser, authToken} = useSelector(state => state.auth);
    const [createType, {isLoading, isSuccess}] = useCreateTypeMutation();

    const [snackBarData,setSnackBar] = useState({
        saved:false,
        savedMessage:'Saved'
    });

    useEffect(() => {
        if(!isLoading && isSuccess){
            setSnackBar({
                saved:true,
                savedMessage:'Type Saved!'
            });
        }
    }, [isLoading, isSuccess]);

    const saveType = async (event) => {
        event.preventDefault();
        try{
            const {level} = currentUser; 
            createType({authToken, type, level});
        }
        catch(e){
            setSnackBar({
                saved:true,
                savedMessage:'Error saving type'
            });
            console.log('error saving type',e);
        }
    }

    const updateInput = (event) => {
        event.persist();
        let val =  event.target.value;
        let currType = {...type};
        currType.name = val;
        setType(currType);
    }

    const setActive = (event) => {
        let val = event.target.checked;
        let currType = {...type};
        currType.active = val;
        setType(currType);
    }

    const snackbarClosed = () => {
        let currSnackbar = {...snackBarData};
        currSnackbar.saved = false;
        setSnackBar(currSnackbar);
    }


    return (
        <div>
            <Typography variant='h4'>Create New Type</Typography>
            <form onSubmit={(e) => saveType(e)}>
                <Grid container>
                    <Grid item xs={12} md={6}>
                        <div className="lesson-container">
                            <FormControlLabel
                                control={
                                <Switch
                                    checked={type.active}
                                    onChange={setActive}
                                    name="active"
                                    color="primary"
                                />
                                }
                                label="Active"
                            />
                        </div>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <div className="lesson-container">
                            <TextField required label="Name" id="name" value={type.name} onChange={(e) => updateInput(e)}/>
                        </div>
                    </Grid>
                    <Grid className="save-button" item xs={12} md={12}>
                        <Button type="submit" variant="contained">Save</Button>
                    </Grid>
                </Grid>
            </form>
            <SnackbarWrapper saved={snackBarData.saved} snackbarClosed={snackbarClosed} saveField={"saved"} savedMessage={snackBarData.savedMessage}/>
        </div>
    )
}


export default CheckPermission()(requiresLogin()(withRouter(CreateType)));