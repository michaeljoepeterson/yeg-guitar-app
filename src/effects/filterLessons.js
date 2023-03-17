import React, {useEffect,useState} from 'react';
import {generalSearch} from '../actions/lessonActions';

/**
 * @deprecated
 * @param {*} filters 
 * @param {*} dispatch 
 */
export const useFilterLessons = (filters,dispatch) => {
    //debounce request to limit second req caused by setting fitlers after props change
    const [loading,setLoading] = useState(false);
    const [prevFilters,setPrevFilters] = useState(filters)
    useEffect(() => {
        
        const diffFilters = (filters) => {
            for(let key in filters){
                if(filters[key] !== prevFilters[key]){
                    return true
                }
            }

            return false;
        }

        const searchLesson = async() => {
            setLoading(true);
            await dispatch(generalSearch(filters));
            setLoading(false);
        }

        const hasDiff = diffFilters(filters);

        if(!loading || hasDiff){
            searchLesson();
        }
        if(hasDiff){
            setPrevFilters(filters);
        }
     }, [filters]);
}