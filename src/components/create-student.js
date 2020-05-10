import React from 'react';
import requiresLogin from '../HOC/requires-login';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {getCategories} from '../actions/categoryActions';
import Select from '@material-ui/core/Select';
import { MenuItem } from '@material-ui/core';

import './styles/create-student.css';

export class CreateStudent extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            categories:[],
            firstName:'',
            lastName:'',
            category:'',
            saved:false,
            savedMessage:'Saved'
        };
    }

    componentDidMount(){
        this.props.dispatch(getCategories())
    }

    fieldChanged = (event,field) => {
        event.persist();
        let value = event.target.value;
        this.setState({
            [field]:value
        });
    }

    snackbarClosed = (name) => {
        this.setState({
            [name]:false
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

        let categorySelect = (<Select onChange={(e) => this.fieldChanged(e,'category')} value={this.state.category} >{categoryItems}</Select>);

        return categorySelect;
    }

    render(){
        console.log(this.state);
        console.log(this.props.categories);

        let categories = this.props.categories ? this.buildCategorySelect(this.props.categories) : [];
        return(
            <div>
                <Typography variant='h4'>Create New Student</Typography>
                <form>
                    <Grid container>
                        <Grid item xs={12} md={4}>
                            <TextField required label="First Name" id="firstName" value={this.state.firstName} onChange={(e) => this.fieldChanged(e,'firstName')}/>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField required label="Last Name" id="lastName" value={this.state.lastName} onChange={(e) => this.fieldChanged(e,'lastName')}/>
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {categories}
                        </Grid>
                        <Grid className="save-button" item xs={12}>
                            <Button type="submit" variant="contained">Save</Button>
                        </Grid>
                    </Grid>
                </form>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    lessonTypes:['Finger Style','Chords', 'Rythm'],
    categories:state.category.categories
});
export default requiresLogin()(withRouter(connect(mapStateToProps)(CreateStudent)));