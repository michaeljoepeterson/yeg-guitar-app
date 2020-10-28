import React from 'react';
import {withRouter} from 'react-router-dom';

export default () => Component => {
    function parseQuery(query){
        //let 
    }

    function GetUrlFilters(props){
        const {location,...passThroughProps} = props;
        let {search} = location;

        return <Component {...passThroughProps} />;
    }
}