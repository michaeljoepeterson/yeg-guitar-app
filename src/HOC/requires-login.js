import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {loadAuthToken} from '../local-storage';

export default () => Component => {
    function RequiresLogin(props){
        let authToken = loadAuthToken();
        const {loading,loggedIn,error,...passThroughProps} = props;
        if((!loggedIn || error)){
            return <Redirect to='/' />;
        }

        return <Component {...passThroughProps} />;
    }

    const mapStateToProps = (state, props) => ({
        loading: state.auth.loading,
        loggedIn: state.auth.currentUser !== null,
        error: state.auth.error
    });

    return connect(mapStateToProps)(RequiresLogin);
};