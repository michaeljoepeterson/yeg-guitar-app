import {
    ADD_LESSON_REQUEST,
    ADD_LESSON_SUCCESS,
    ADD_LESSON_ERROR,
    GET_LESSON_REQUEST,
    GET_LESSON_SUCCESS,
    GET_LESSON_ERROR,
    SET_LESSON,
    GET_STUDENT_LESSON_SUCCESS,
    GET_LESSON_TYPES_SUCCESS,
    DELETE_LESSON_SUCCESS
} from '../actions/lessonActions';

const initialState = {
    error:null,
    loading:false,
    message:null,
    lessons:[],
    selectedLesson:null,
    studentLessons:null,
    lessonTypes:[]
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

    else if(action.type === SET_LESSON){
        return Object.assign({},state,{
            selectedLesson:action.lesson
        });
    }

    else if(action.type === GET_STUDENT_LESSON_SUCCESS){
        return Object.assign({},state,{
            studentLessons:action.lessons
        });
    }

    else if(action.type === GET_LESSON_TYPES_SUCCESS){
        //debugger
        return Object.assign({},state,{
            lessonTypes:action.types,
            loading:false,
            error:null
        });
    }

    else if(action.type === DELETE_LESSON_SUCCESS){
        let {id} = action;
        let lessons = state.lessons?.filter(lesson => lesson.id !== id);
        return Object.assign({},state,{
            lessonTypes:action.types,
            loading:false,
            error:null,
            lessons
        });
    }

    return state;
}