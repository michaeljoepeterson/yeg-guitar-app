import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {API_BASE_URL} from '../config';
import {normalizeResponseErrors} from '../actions/utils';
import {Link} from 'react-router-dom';
import './styles/center.css';
import './styles/login.css';

export default class CreateAdmin extends React.Component{
    
    constructor(props){
        super(props)
        this.state = {
            email:'',
            pass:'',
            pass2:'',
            loading:false,
            error:null,
            title:'Update Password'
        }
    }

    inputChanged = (event,key) => {
        event.persist();
        const value = event.target.value;
        this.setState({
            [key]:value
        });
    }
    //to do move to reducer
    createAdmin = (event) =>{
        event.preventDefault();
        this.setState({
            error:null
        });
        if(this.state.pass === this.state.pass2){
            const email = this.state.email;
            const password = this.state.pass;
            fetch(`${API_BASE_URL}/users`,{
                method:'PUT',
                headers:{
                    'Content-Type':'application/json'
                },
                body:JSON.stringify({
                    email,
                    password
                })
            })
            .then(res => normalizeResponseErrors(res))
            .then(res => res.json())
            .then((jsonRes) => {
                console.log(jsonRes);
                if(jsonRes.code === 401){
                    this.setState({
                        error:'Admin Exists'
                    });
                }
                else if(jsonRes.code === 400){
                    this.setState({
                        error:'Cannot update password'
                    });
                }
                else{
                    this.setState({
                        error:'Updated Password'
                    });
                }
            })
            .catch(err => {
                console.log('error creating admin: ',err);
                this.setState({
                    error:'Creating Admin'
                });
            })
        }
        else{
            this.setState({
                error:'Passwords do not match'
            });
        }

    }

    render(){
        const displayLoading = this.state.loading ? true : false;

        return(
            <div className="center-container">
                <div className="login-container center-container">
                    <form className="login-form" onSubmit={(e) => this.createAdmin(e)}>
                        <Typography variant='h4' className="form-title">{this.state.title}</Typography>
                        <div className="input-container">
                        <TextField required id="user" label="Email" variant="outlined" helperText={this.state.error ? this.state.error : ''} onChange={(e) => this.inputChanged(e,'email')}/>
                        </div>
                        <div className="input-container">
                            <TextField required id="password" label="Password" variant="outlined" type="password" helperText={this.state.error ? this.state.error : ''} onChange={(e) => this.inputChanged(e,'pass')}/>
                        </div>
                        <div className="input-container">
                            <TextField required id="password" label="Enter Password Again" variant="outlined" type="password" helperText={this.state.error ? this.state.error : ''} onChange={(e) => this.inputChanged(e,'pass2')}/>
                        </div>
                        <div className="input-container">
                            <CircularProgress className={displayLoading ? '' : 'hidden'} />
                            <Link to="/">
                                <Button className={this.displayLoading ? 'hidden' : ''} variant="contained" color="primary">
                                Login
                                </Button>
                            </Link>
                            <Button className={displayLoading ? 'hidden' : ''} variant="contained" color="primary" type="submit">Update</Button>
                        </div>
                    </form>
                </div>
                
            </div>
        );
    }
}