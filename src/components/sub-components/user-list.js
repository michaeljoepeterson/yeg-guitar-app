import React from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Divider from '@material-ui/core/Divider';
import {Route, withRouter } from 'react-router-dom';
import './styles/user-list.css';

export class UserList extends React.Component{
    constructor(props) {
        super(props);

        this.state = {

        };
    }

    selectUser = (user) => {
        console.log('selected user: ',user);
        this.props.history.push(`/summary/${user.id}`);
    }

    buildList = () =>{

        let list = [];
        for(let i = 0;i < this.props.users.length;i++){
            let user = this.props.users[i];
            let userItem = this.props.summary ? (
                <ListItem button key={i} onClick={(e) => this.selectUser(user)}>
                    <ListItemText primary={!user.fullName ? user.username : user.fullName} />
                </ListItem>
            ) : 
            (
                <ListItem button key={i}>
                    <ListItemText primary="test" />
                </ListItem>
            );
            list.push(
                userItem
            )
        }

        return (
            <List>
                {list}
            </List>
        );
    }

    render(){
        //console.log(this.state);
        console.log('users:',this.props.users);
        const list = this.props.users && this.props.users.length > 0 ? this.buildList() : []; 
        return(
            <div className="users-container">
                {list}
            </div>
        );
    }
}


export default (withRouter(UserList));