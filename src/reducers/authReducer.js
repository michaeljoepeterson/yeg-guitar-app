import {
    AUTH_SUCCESS,
    AUTH_REQUEST,
    AUTH_ERROR,
    LOGOUT
} from '../actions/authActions';

const initialState = {
    currentUser:null,
    error:null,
    loading:false,
    authToken:null
};

export default function reducer(state = initialState,action){
    if(action.type === AUTH_REQUEST){
        return Object.assign({},state,{
            loading:true,
            error:null,
            currentUser:null,
            authToken:null
        });
    }
    else if(action.type === AUTH_ERROR){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            currentUser:null,
            authToken:null
        });
    }
    
    else if(action.type === AUTH_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:null,
            currentUser:action.currentUser,
            authToken:action.token
        });
    }

    else if(action.type === LOGOUT){
        return Object.assign({},state,{
            loading:false,
            error:null,
            currentUser:null,
            authToken:null
        });
    }

    return state;
}