import React from 'react';
import {useSelector} from 'react-redux';
import LoginForm from './login-form';
import { Redirect } from 'react-router';
import { withRouter} from 'react-router-dom';

export function LandingPage(props){
    const title = 'Edmonton Guitar';
    const {currentUser, loading} = useSelector(state => state.auth);
    if(loading){
        return null;
    }

    if(currentUser && props.location.pathname === '/'){
        return <Redirect to='/create-lesson'/>;
    }
    
    if(props.location.pathname.includes('/test')){
        return <Redirect to='/'/>;
    }
    
    return(
        <div className="center-container">
            <LoginForm title={title}/>
        </div>
    )
}

export default withRouter(LandingPage);