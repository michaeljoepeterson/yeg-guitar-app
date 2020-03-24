import React from 'react';
import {connect} from 'react-redux';
import LoginForm from './login-form';
import { Redirect } from 'react-router';

export function LandingPage(props){
    const title = 'Edmonton Guitar';
    if(props.currentUser){
        return <Redirect to='/create-lesson'/>;
    }
    return(
        <div className="center-container">
            <LoginForm title={title}/>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    error:state.auth.error
});
export default connect(mapStateToProps)(LandingPage);