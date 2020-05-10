import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logoutSession} from '../actions/authActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import './styles/navbar.css';
//add logout functions
export class Navbar extends React.Component{
    //should change this to state
    displayNav;
    
    logout = (event) => {
        event.preventDefault();
        this.props.dispatch(logoutSession());
    }

    render(){
        this.displayNav = this.props.currentUser != null ? true : false;
        return(
            <div className={this.displayNav ? '' : 'hidden'}>
                <AppBar position="static" className="navbar">
                    <Toolbar>
                        <IconButton edge="start" color="inherit" aria-label="menu">
                            <MenuIcon />
                        </IconButton>
                        <Typography variant='h6'><Link to="/create-lesson">Create Lesson </Link></Typography>
                        <Typography variant='h6'><Link to="/example-table"> | View Lessons</Link></Typography>
                        <Typography variant='h6'><Link to="/create-student"> | Create Student</Link></Typography>
                        <Typography className="logout" variant='h6'><a href="/" onClick={this.logout}>Logout</a></Typography>
                    </Toolbar>
                </AppBar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser
});
export default connect(mapStateToProps)(Navbar);