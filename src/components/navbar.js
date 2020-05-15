import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logoutSession} from '../actions/authActions';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import { Navbar,Nav,Button } from 'react-bootstrap';
import './styles/navbar.css';
//add logout functions
export class TopNav extends React.Component{
    //should change this to state
    

    constructor(props) {
        super(props);
        this.displayNav = false;
        /*
        this.possibleLinks = [[(
        <Nav className="mr-auto">
            <Nav.Link as={Link} to="/create-lesson">Create Lesson</Nav.Link>
            <Nav.Link as={Link} to="/example-table">View Lessons</Nav.Link>
            <Nav.Link as={Link} to="/create-student">Create Student</Nav.Link>
        </Nav>)],[],[]];
        */
       this.possibleLinks = [
           {
               link:'/create-lesson',
               display:'Create Lesson',
               level:2
           },
           {
                link:'/example-table',
                display:'View Lessons',
                level:0
           },
           {
                link:'/create-student',
                display:'Create Student',
                level:1
            }
       ];
      }
    
    logout = (event) => {
        event.preventDefault();
        this.props.dispatch(logoutSession());
    }

    getNavLinks = () => {
        console.log(this.props.currentUser);
        let {level} = this.props.currentUser;
        let links = [];
        for(let i = 0;i < this.possibleLinks.length;i++){
            let possibleLink = this.possibleLinks[i];
            let linkLevel = possibleLink.level;
            if(level <= linkLevel){
                links.push(
                    <Nav.Link as={Link} to={possibleLink.link} key={i}>{possibleLink.display}</Nav.Link>
                );
            }
        }

        return links;
    }

    render(){
        this.displayNav = this.props.currentUser != null ? true : false;
        let links = this.props.currentUser != null ? this.getNavLinks() : [];
        return(
            /*
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
            */
           <div className={this.displayNav ? '' : 'hidden'}>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand href="/create-lesson">EGMS</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                            {links}
                        </Nav>
                        <Button variant="outline-light" onClick={this.logout}>Logout</Button>
                    </Navbar.Collapse>
                </Navbar>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser
});
export default connect(mapStateToProps)(TopNav);