import {normalizeResponseErrors} from './utils';
import {API_BASE_URL} from '../config';

//use this as generic student request
export const CATEGORY_REQUEST = 'CATEGORY_REQUEST';
export const categoryRequest = () => ({
    type:CATEGORY_REQUEST
});

export const GET_CATEGORY_SUCCESS = 'GET_CATEGORY_SUCCESS';
export const getCategorySuccess = (categories) => ({
    type:GET_CATEGORY_SUCCESS,
    categories
});
//use this as generic student error
export const CATEGORY_ERROR = 'CATEGORY_ERROR';
export const categoryError = (error) => ({
    type:CATEGORY_ERROR,
    error
});

export const getCategories = () => (dispatch,getState) => {
    dispatch(categoryRequest());
    const authToken = getState().auth.authToken;

    return (
        fetch(`${API_BASE_URL}/category`,{
            method:'GET',
            headers:{
                Authorization: `Bearer ${authToken}`
            }
        })

        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then((categories) => {
            
            dispatch(getCategorySuccess(categories.categories));
        })
        .catch(err => {
            console.log('error getting categories ',err);
            dispatch(categoryError(err));
        })
    );
};