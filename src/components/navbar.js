import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {logoutSession} from '../actions/authActions';
import { Navbar,Nav,Button, NavDropdown } from 'react-bootstrap';
import {possibleLinks} from '../config';
import './styles/navbar.css';
//add logout functions
export class TopNav extends React.Component{
    //should change this to state
    

    constructor(props) {
        super(props);
        this.displayNav = false;
        this.possibleLinks = possibleLinks;
      }
    
    logout = (event) => {
        event.preventDefault();
        this.props.dispatch(logoutSession());
    }

    getNavLinks = () => {
        //console.log(this.props.currentUser);
        let {level} = this.props.currentUser;
        let links = [];
        for(let i = 0;i < this.possibleLinks.length;i++){
            let possibleLink = this.possibleLinks[i];
            let linkLevel = possibleLink.level;

            if(level <= linkLevel){
                if(!possibleLink.query && !possibleLink.sublinks){
                    links.push(
                        <Nav.Link as={Link} to={possibleLink.link} key={i}>{possibleLink.display}</Nav.Link>
                    );
                }
                else if(possibleLink.query && possibleLink.query.name === 'teacher'){
                    links.push(
                        <Nav.Link  as={Link} to={possibleLink.link + `?${possibleLink.query.name}=${this.props.currentUser.username}`} key={i}>{possibleLink.display}</Nav.Link>
                    );
                }
                else if(possibleLink.sublinks){
                    links.push(
                        <NavDropdown key={possibleLink.display} title={possibleLink.display}>
                            {
                                possibleLink.sublinks.map(sublink => {
                                return(<NavDropdown.Item key={sublink.link} as={Link} to={sublink.link}>{sublink.display}</NavDropdown.Item>)
                                })
                            }
                        </NavDropdown>
                    )
                }
            }
        }

        return links;
    }

    render(){
        this.displayNav = this.props.currentUser != null ? true : false;
        let links = this.props.currentUser != null ? this.getNavLinks() : [];
        const brand = this.props.testMode ? 'TEST' : 'EGMS';
        return(
           <div className={this.displayNav ? '' : 'hidden'}>
            <Navbar bg="dark" expand="lg" variant="dark">
                <Navbar.Brand as={Link} to="/create-lesson">{brand}</Navbar.Brand>
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
    currentUser: state.auth.currentUser,
    testMode:state.auth.testMode
});
export default connect(mapStateToProps)(TopNav);