import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

export default () => Component => {
    function RequiresLogin(props){
        const {loading,loggedIn,error,...passThroughProps} = props;
        if(!loggedIn || error){
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