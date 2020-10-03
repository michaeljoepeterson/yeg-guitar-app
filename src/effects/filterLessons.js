import React, {useEffect,useState} from 'react';
import {generalSearch} from '../actions/lessonActions';

export const useFilterLessons = (filters,dispatch) => {
    useEffect(() => {
        dispatch(generalSearch(filters));
     }, [filters]);
}