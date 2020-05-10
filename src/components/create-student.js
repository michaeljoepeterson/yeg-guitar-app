import React from 'react';
import requiresLogin from '../HOC/requires-login';
import { withRouter} from 'react-router-dom';
import {connect} from 'react-redux';
import Grid from '@material-ui/core/Grid';
import {getCategories} from '../actions/categoryActions';

import './styles/create-lesson.css';

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
        //console.log(this.state);
        console.log(this.props.categories);
        return(
            <div>
                <p>test</p>
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