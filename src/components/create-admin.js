import React from 'react';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import {Link} from 'react-router-dom';
import './styles/center.css';
import './styles/login.css';
import {connect} from 'react-redux';

/**
 * deprecated
 */
export class CreateAdmin extends React.Component{
    
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
    createAdmin = async (event) =>{
        event.preventDefault();
        this.setState({
            error:null
        });
        if(this.state.pass === this.state.pass2){
            try{
    
                this.setState({
                    error:'User Created'
                });
            }
            catch(e){
                this.setState({
                    error:e.message ? e.message : 'Error creating account'
                });
            }
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
                        <div className="input-container login-container">
                            <CircularProgress className={displayLoading ? '' : 'hidden'} />
                            <div>
                                <Link to="/">
                                    <Button className={this.displayLoading ? 'hidden' : ''} variant="contained" color="primary">
                                    Login
                                    </Button>
                                </Link>
                            </div>
                            <div>
                                <Button className={displayLoading ? 'hidden' : ''} variant="contained" color="primary" type="submit">Create</Button>
                            </div>
                        </div>
                    </form>
                </div>
                
            </div>
        );
    }
}

const mapStateToProps = state => ({
    currentUser: state.auth.currentUser,
    error:state.auth.error,
    loading:state.auth.loading
});
export default connect(mapStateToProps)(CreateAdmin);