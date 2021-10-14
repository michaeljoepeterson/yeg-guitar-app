import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import LevelSelect from './level-select';
import Button from '@material-ui/core/Button';
import {connect} from 'react-redux';
import {updateUser} from '../../actions/userActions'
import './styles/add-user.css';

export function AddUser(props){
    const [selectedLevel, setSelectedLevel] = useState('');
    const [email,setEmail] = useState('');
    const [firstName,setFirstName] = useState('');
    const [lastName,setLastName] = useState('');

    const handleLevelChanged = (level) => {
        console.log(level);
        setSelectedLevel(level);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        let user = {
            username:email,
            firstName,
            lastName,
            level:selectedLevel
        }
        try{
            await updateUser(props.authToken,user,props.currentUser);
            if(props.userUpdated){
                props.userUpdated(user);
            }
        }
        catch(e){
            console.warn(e);
        }
    }

    const updateInput = (event,setCallback) => {
        let value = event.target.value;
        setCallback(value);
    }

    return (
        <div>
            <h4>
                Add a User
            </h4>
            <form className="add-user-form" onSubmit={e => handleSubmit(e)}>
                <TextField className="full-input" id="email" label="Email" variant="standard" onChange={e => updateInput(e,setEmail)}/>
                <TextField className="full-input" id="first-name" label="First Name" variant="standard" onChange={e => updateInput(e,setFirstName)}/>
                <TextField className="full-input" id="last-name" label="Last Name" variant="standard" onChange={e => updateInput(e,setLastName)}/>
                <LevelSelect levelChanged={handleLevelChanged} level={selectedLevel}/>
                <Button className="add-user-button" type="submit"variant="contained">Submit</Button>
            </form>
        </div>
    )
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    authToken: state.auth.authToken
});

export default connect(mapStateToProps)(AddUser);