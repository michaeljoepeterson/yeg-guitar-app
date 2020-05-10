import React from 'react';
import requiresLogin from '../HOC/requires-login';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import {getCategories} from '../actions/categoryActions';

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

    render(){
        console.log(this.state);
        console.log(this.props.categories);
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
                            <TextField required label="Category" id="category" value={this.state.category} onChange={(e) => this.fieldChanged(e,'category')}/>
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