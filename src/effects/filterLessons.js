import React, {useEffect,useState} from 'react';
import {generalSearch} from '../actions/lessonActions';

export const useFilterLessons = (filters,dispatch) => {
    //debounce request to limit second req caused by setting fitlers after props change
    const [loading,setLoading] = useState(false);
    useEffect(() => {
        const searchLesson = async() => {
            setLoading(true);
            await dispatch(generalSearch(filters));
            setLoading(false);
        }
        if(!loading){
            searchLesson();
        }
     }, [filters]);
}