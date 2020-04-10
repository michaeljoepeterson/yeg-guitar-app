import {
    ADD_LESSON_REQUEST,
    ADD_LESSON_SUCCESS,
    ADD_LESSON_ERROR,
    GET_LESSON_REQUEST,
    GET_LESSON_SUCCESS,
    GET_LESSON_ERROR
} from '../actions/lessonActions';

const initialState = {
    error:null,
    loading:false,
    message:null,
    lessons:[]
};

const successMessage = "Lesson Created!";

export default function reducer(state = initialState,action){
    if(action.type === ADD_LESSON_REQUEST){
        return Object.assign({},state,{
            loading:true,
            error:null,
            message:null
        });
    }
    
    else if(action.type === ADD_LESSON_ERROR){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            message:null
        });
    }
    
    else if(action.type === ADD_LESSON_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:null,
            message:successMessage
        });
    }

    else if(action.type === GET_LESSON_REQUEST){
        return Object.assign({},state,{
            loading:true,
            error:null,
            message:null,
            lessons:[]
        });
    }

    else if(action.type === GET_LESSON_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:null,
            message:successMessage,
            lessons:action.lessons
        });
    }

    else if(action.type === GET_LESSON_ERROR){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            message:null,
            lessons:[]
        });
    }

    return state;
}