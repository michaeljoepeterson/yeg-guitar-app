import React, {useState} from 'react';
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
import './styles/user-management.css';
import ModalWrapper from '../sub-components/modal-wrapper';
import AddUser from '../sub-components/add-user';
import {useSelector} from 'react-redux';
import { useGetUsersQuery, useUpdateUserMutation } from '../../store/api/users-api';

const UserManagement = (props) => {
    const [addModalOpen, setAddModalOpen] = useState(false);
    const [teachers,setTeachers] = useState(null);
    const {currentUser, authToken} = useSelector(state => state.auth);
    const {data: allTeachers} = useGetUsersQuery({authToken});
    const [updateUser] = useUpdateUserMutation();

    const handleLevelChanged = async (level,user) => {
        let newUser = {...user};
        newUser.level = level !== '' ? level : null;
        await updateUser({authToken, user: newUser, level: currentUser.level});
    }

    const openAddUserModal = () => {
        setAddModalOpen(true);
    }

    const handleModalClose = () => {
        setAddModalOpen(false);
    }

    const userUpdated = (user) => {
        setAddModalOpen(false);
        let currentTeachers = teachers ? [...teachers] : [...allTeachers];
        currentTeachers.push(user);
        setTeachers(currentTeachers);
        console.log(teachers);
    }

    let renderedTeachers = teachers ? teachers : allTeachers;

    return(
        <div>
            <div className="add-button-container">
                <Button variant="contained" onClick={e => openAddUserModal()}>Add User</Button>
                <ModalWrapper handleClose={handleModalClose} open={addModalOpen}>
                    <div>
                        <AddUser userUpdated={userUpdated}/>
                    </div>
                </ModalWrapper>
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
                            renderedTeachers ? renderedTeachers.map(user => (
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

export default CheckPermission()(requiresLogin()(UserManagement));