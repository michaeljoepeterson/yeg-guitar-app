import {
    ADD_LESSON_REQUEST,
    ADD_LESSON_SUCCESS,
    ADD_LESSON_ERROR
} from '../actions/recipeActions';

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
            error:action.error
        });
    }
    
    else if(action.type === ADD_LESSON_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:null,
            message:successMessage
        });
    }

    return state;
}