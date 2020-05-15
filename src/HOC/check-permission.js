import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import {possibleLinks} from '../config';
import {withRouter} from 'react-router-dom';

export default () => Component => {
    function CheckPermission(props){
        const {location,user,...passThroughProps} = props;
        if(location && user){
            let userLevel = user.level || user.level === 0? user.level : null;
            let path = location.pathname;
            let page = possibleLinks.find(link => link.link === path);
            console.log(location.pathname,userLevel);
            if(userLevel <= page.level){
                return <Component {...passThroughProps} />;
            }
            else{
                return <Redirect to='/create-lesson' />;
            }
            
        }
        else{
            return <Component {...passThroughProps} />; 
        }

        
    }

    const mapStateToProps = (state, props) => ({
        loading: state.auth.loading,
        user: state.auth.currentUser,
        error: state.auth.error
    });

    return withRouter(connect(mapStateToProps)(CheckPermission));
};