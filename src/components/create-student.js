import React from 'react';
import requiresLogin from '../HOC/requires-login';
import CheckPermission from '../HOC/check-permission';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {getCategories} from '../actions/categoryActions';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';
import {createStudent} from '../actions/studentActions';
import SnackbarWrapper from './snackbar-wrapper';
import InputLabel from '@material-ui/core/InputLabel';
import AddCircleOutlinedIcon from '@material-ui/icons/AddCircleOutlined';
import IconButton from '@material-ui/core/IconButton';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { Student } from '../models/student';

import './styles/create-student.css';
import './styles/create-lesson.css';

export class CreateStudent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            //categrories for the student
            student:new Student(),
            saved:false,
            savedMessage:'Saved',
            categoryCount:1,
            active:true
        };
    }

    componentDidMount(){
        this.props.dispatch(getCategories())
    }

    fieldChanged = (event,field) => {
        event.persist();
        let value = event.target.value;
        let student = new Student(this.state.student);
        student[field] = value;
        this.setState({
            [field]:value,
            student
        });
    }

    categoryChanged = (event,index) => {
        event.persist();
        let value = event.target.value;
        let categories = [...this.state.student.category];
        
        categories = categories.map((category,i) => {
            if(i === index){
                return value;
            }
            else {
                return category
            }
        });
        let student = new Student(this.state.student);
        student.category = [...categories];
        this.setState({
            categories,
            student
        });
    }

    buildCategorySelect = (categories) => {
        let categoryItems = [];

        for(let i = 0;i < categories.length;i++){
            const item = categories[i];
            categoryItems.push(
                <MenuItem value={item.id} key={i}>{item.name}</MenuItem>
            );
        }
        let selects = [];
        for(let i = 0;i < this.state.categoryCount;i++){
            selects.push(
                <Grid className="student-row" item xs={12} md={3} key={i}>
                    <Select onChange={(e) => this.categoryChanged(e,i)} value={this.state.student.category[i]} >{categoryItems}</Select>
                    <IconButton onClick={(e) => this.removeCategory(i)} aria-label="remove student">
                        <CancelOutlinedIcon/>
                    </IconButton>
                </Grid>
            )
        }

        let finalSelect = [];
        finalSelect.push(
            <Grid container item xs={12} key={0}>
                {selects}
            </Grid>
        );

        return finalSelect;
    }

    saveStudent = (event) =>{
        event.persist();
        event.preventDefault();
        const student = this.state.student.getReq();
        this.props.dispatch(createStudent(student,this.props.currentUser.level))

        .then(res => {
            let {code} = res;
            
            if(code === 200){
                this.setState({
                    saved:true,
                    savedMessage:'Student Saved!'
                });
            }
            else{
                this.setState({
                    saved:true,
                    savedMessage:'Error saving student'
                });
            }
        })

        .catch(err => {
            console.log(err);
        });
    }

    snackbarClosed = (name) => {
        this.setState({
            [name]:false
        });
    }

    addCategory = () =>{
        const categoryCount = this.state.categoryCount + 1;
        let categories = [...this.state.student.category];
        categories.push('');
        let student = new Student(this.state.student);
        student.category = [...categories];
        this.setState({
            categoryCount,
            categories
        });
    }

    removeCategory = (index) =>{
        const categoryCount = this.state.categoryCount - 1;
        const categories = this.state.student.category.filter((category,i) => index !== i);
        let student = new Student(this.state.student);
        student.category = [...categories];
        this.setState({
            categoryCount,
            categories
        });
    }

    setActive = (event) =>{
        let student = new Student(this.state.student);
        student.active = event.target.checked;
        this.setState({
            active:event.target.checked,
            student
        });
    }

    render(){     
        console.log(this.state);

        let categories = this.props.categories ? this.buildCategorySelect(this.props.categories) : [];
        return(
            <div>
                <Typography variant='h4'>Create New Student</Typography>
                <form onSubmit={(e) => this.saveStudent(e)}>
                    <Grid container>
                        <Grid item xs={12} md={3}>
                            <div className="lesson-container">
                                <FormControlLabel
                                    control={
                                    <Switch
                                        checked={this.state.student.active}
                                        onChange={this.setActive}
                                        name="active"
                                        color="primary"
                                    />
                                    }
                                    label="Active"
                                />
                            </div>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <div className="lesson-container">
                                <TextField required label="First Name" id="firstName" value={this.state.student.firstName} onChange={(e) => this.fieldChanged(e,'firstName')}/>
                            </div>
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <div className="lesson-container">
                                <TextField required label="Last Name" id="lastName" value={this.state.student.lastName} onChange={(e) => this.fieldChanged(e,'lastName')}/>
                            </div>       
                        </Grid>
                        <Grid item xs={12} md={3}>
                            <IconButton aria-label="add category" onClick={(e) => this.addCategory()}>
                                <AddCircleOutlinedIcon />
                            </IconButton>
                            <InputLabel className="student-label" id="categories">Categories</InputLabel>
                            {categories}
                        </Grid>
                        <Grid className="save-button" item xs={12}>
                            <Button type="submit" variant="contained">Save</Button>
                        </Grid>
                    </Grid>
                </form>
                <SnackbarWrapper saved={this.state.saved} snackbarClosed={this.snackbarClosed} saveField={"saved"} savedMessage={this.state.savedMessage}/>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    categories:state.category.categories
});
export default CheckPermission()(requiresLogin()(withRouter(connect(mapStateToProps)(CreateStudent))));