import React from 'react';
import {withRouter} from 'react-router-dom';

export default () => Component => {
    const targetParams = ['start-date','end-date','startdate','enddate'];

    function parseQuery(query,name){
        let regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)');
        let results = regex.exec(query);
        let resultsObj = {
            name,
            result:null
        }
        if (!results) return resultsObj;
        if (!results[2]) return resultsObj;
        let result = decodeURIComponent(results[2].replace(/\+/g, ' '));
        resultsObj.result = result;
        return resultsObj
    }

    function mapResults(){
        let mappedResults = {
            startDate:null,
            endDate:null
        };
    }

    function GetUrlFilters(props){
        const {location,...passThroughProps} = props;
        let {search} = location;
        let startDate = null;
        let endDate = null
        if(search){
            console.log('query: ',search);
            let results = targetParams.map(name => {
                return parseQuery(search,name);
            });
            results = results.filter(result => result.result);
            console.log(results);
        }
        return <Component startDate={startDate} endDate={endDate} {...passThroughProps} />;
    }

    return withRouter(GetUrlFilters);
}