import React from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Link} from 'react-router-dom';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import CircularProgress from '@material-ui/core/CircularProgress';
import './styles/center.css';
import './styles/login.css';
import { useCallback } from 'react';
import { signInWithGoogle } from '../store/slices/auth-slice';

export class LoginForm extends React.Component{
    //should change this to state
    //only working cus of rerender in overall state
    constructor(props){
        super(props)
        this.state = {
            email:'',
            pass:'',
            loading:false
        }
    }

    inputChanged = (event,key) => {
        event.persist();
        const value = event.target.value;
        this.setState({
            [key]:value
        });
    }
    
   tryLogin = (event) =>{
        event.persist();
        event.preventDefault();
        
    }

    googleSignIn = async () => {
        try{
            this.props.googleSignIn();
        }
        catch(e){
            console.log('error with google sign in page: ',e);
        }
    }

    render(){
        this.displayLoading = this.props.loading ? true : false;
        return(
            <div className="login-container center-container">
                <form className="login-form" onSubmit={(e) => this.tryLogin(e)}>
                    <Typography variant='h4' className="form-title">{this.props.title}</Typography>
                    <div className="input-container">
                        <TextField required id="user" label="Email" variant="outlined" helperText={this.props.error ? this.props.error : ''} onChange={(e) => this.inputChanged(e,'email')}/>
                    </div>
                    <div className="input-container">
                        <TextField required id="password" label="Password" variant="outlined" type="password" helperText={this.props.error ? this.props.error : ''} onChange={(e) => this.inputChanged(e,'pass')}/>
                    </div>
                    <div className="input-container login-container">
                        <CircularProgress className={this.displayLoading ? '' : 'hidden'} />
                        <div>
                            <Button className={this.displayLoading ? 'hidden' : ''} variant="contained" color="primary" type="submit">Login</Button>
                        </div>
                        <div>
                            <Button onClick={(e) => this.googleSignIn()} className={this.displayLoading ? 'hidden' : ''} variant="contained" color="primary" type="button">Login With Google</Button>
                        </div>
                        <div>
                            <Link to="/create-admin">
                                <Button className={this.displayLoading ? 'hidden' : ''} variant="contained" color="primary">
                                Create
                                </Button>
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        )
    }
    
}


const StateWrapper = (Component) => function Comp(props){
    const auth = useSelector((state) => state.auth);
    const {currentUser, loading, error} = auth;
    const dispatch = useDispatch();
    console.log('err', error);

    const googleSignIn = useCallback(() => {
        dispatch(signInWithGoogle());
    }, [dispatch]);

    return (
        <Component 
            currentUser={currentUser} 
            loading={loading}
            error={error}
            googleSignIn={googleSignIn}
            {...props}
        />
    )
}

export default StateWrapper(LoginForm);