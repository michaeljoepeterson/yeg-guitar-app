import React from 'react';
import {useGetTeachers} from '../../effects/getData';
import {connect} from 'react-redux';
import requiresLogin from '../../HOC/requires-login';
import CheckPermission from '../../HOC/check-permission';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import LevelSelect from '../sub-components/level-select';
import Button from '@material-ui/core/Button';
import {updateUser} from '../../actions/userActions'
import './styles/user-management.css'

const UserManagement = (props) => {
    const allTeachers = useGetTeachers(props.authToken,props.dispatch);

    const handleLevelChanged = (level,user) => {
        console.log(user,level);
        let newUser = {...user};
        newUser.level = level;
        updateUser(props.authToken,newUser,props.currentUser);
    }

    const openAddUserModa = () => {
        
    }

    return(
        <div>
            <div className="add-button-container">
                <Button variant="contained">Add User</Button>
            </div>
            <TableContainer component={Paper}>
                <Table aria-label="simple table">
                    <TableHead>
                    <TableRow>
                        <TableCell>Email</TableCell>
                        <TableCell align="left">First Name</TableCell>
                        <TableCell align="left">Last Name</TableCell>
                        <TableCell align="left">Level</TableCell>
                    </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            allTeachers ? allTeachers.map(user => (
                                <TableRow
                                key={user.username}
                                >
                                    <TableCell component="th" scope="row">
                                        {user.username}
                                    </TableCell>
                                    <TableCell align="left">{user.firstName}</TableCell>
                                    <TableCell align="left">{user.lastName}</TableCell>
                                    <TableCell align="left">
                                        <LevelSelect levelChanged={handleLevelChanged} user={user} level={user.level}/>
                                    </TableCell>
                                </TableRow>
                            )) : null
                        }
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    )
}

const mapStateToProps = state => ({
    isLoading: state.lessons.loading,
    currentUser: state.auth.currentUser,
    authToken: state.auth.authToken
});

export default  CheckPermission()(requiresLogin()(connect(mapStateToProps)(UserManagement)));