import React, {useState} from 'react';
import requiresLogin from '../../HOC/requires-login';
import CheckPermission from '../../HOC/check-permission';
import {connect} from 'react-redux';
import { withRouter} from 'react-router-dom';
import {createType} from '../../actions/lessonActions';
import Grid from '@material-ui/core/Grid';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import SnackbarWrapper from '../snackbar-wrapper';
import Typography from '@material-ui/core/Typography';
import { LessonType } from '../../models/lesson-type';

import '../styles/create-lesson.css';

function CreateType(props){
    const [type,setType] = useState(new LessonType());

    const [snackBarData,setSnackBar] = useState({
        saved:false,
        savedMessage:'Saved'
    });

    const saveType = async (event) => {
        event.preventDefault();
        try{
            const {level} = props.currentUser; 
            let res = await props.dispatch(createType(type,level));
            let {code} = res;
            if(code === 200){
                setSnackBar({
                    saved:true,
                    savedMessage:'Type Saved!'
                });
            }
            else{
                setSnackBar({
                    saved:true,
                    savedMessage:'Error saving type'
                });
            }
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

const mapStateToProps = state => ({
    isLoading: state.lessons.loading,
    currentUser: state.auth.currentUser
});

export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(CreateType))));