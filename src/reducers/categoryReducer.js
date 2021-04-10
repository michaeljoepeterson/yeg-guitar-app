import {
    CATEGORY_REQUEST,
    GET_CATEGORY_SUCCESS,
    CATEGORY_ERROR
} from '../actions/categoryActions';

const initialState = {
    categories:null,
    error:null,
    loading:false,
};

export default function reducer(state = initialState,action){
    if(action.type === CATEGORY_REQUEST){
        return Object.assign({},state,{
            loading:true,
            error:null,
            students:null
        });
    }
    else if(action.type === GET_CATEGORY_SUCCESS){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            categories:action.categories
        });
    }
    
    else if(action.type === CATEGORY_ERROR){
        return Object.assign({},state,{
            loading:false,
            error:action.error,
            students:null
        });
    }

    return state;
}