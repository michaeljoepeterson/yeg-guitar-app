import React from 'react';
import requiresLogin from '../HOC/requires-login';
import {Route, withRouter} from 'react-router-dom';
import {connect} from 'react-redux';

export class CreateLesson extends React.Component{
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render(){
        return(
            <div>
                test
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser
});
export default requiresLogin()(withRouter(connect(mapStateToProps)(CreateLesson)));