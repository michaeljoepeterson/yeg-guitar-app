import {
    USER_REQUEST,
    GET_USER_SUCCESS,
    USER_ERROR,
    CREATE_USER_SUCCESS
} from '../actions/userActions';

const initialState = {
    error:null,
    loading:false,
    message:null,
    users:[]
};



export default function reducer(state = initialState,action){
    const successMessage = "User Found!";

    if(action.type === USER_REQUEST){
        return Object.assign({},state,{
            loading:true,
            error:null,
            message:null,
            users:[]
        });
    }

    else if(action.type === GET_USER_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:null,
            message:successMessage,
            users:action.users
        });
    }

    else if(action.type === USER_ERROR){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            message:null,
            users:[]
        });
    }

    else if(action.type === CREATE_USER_SUCCESS){
        return Object.assign({},state,{
            selectedLesson:action.lesson
        });
    }

    return state;
}