import {
    GET_STUDENT_REQUEST,
    GET_STUDENT_SUCCESS,
    GET_STUDENT_ERROR
} from '../actions/studentActions';

const initialState = {
    students:null,
    error:null,
    loading:false,
};

export default function reducer(state = initialState,action){
    if(action.type === GET_STUDENT_REQUEST){
        return Object.assign({},state,{
            loading:true,
            error:null,
            students:null
        });
    }
    else if(action.type === GET_STUDENT_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            students:action.students
        });
    }
    
    else if(action.type === GET_STUDENT_ERROR){
        return Object.assign({},state,{
            loading:false,
            error:null,
            students:null
        });
    }

    return state;
}