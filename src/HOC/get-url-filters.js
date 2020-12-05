import React from 'react';
import {withRouter} from 'react-router-dom';

export default () => Component => {
    const startDateNames = ['start-date','startdate']; 
    const endDateNames = ['end-date','enddate']; 
    const teacherNames = ['teacher','user','username']; 

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
        return resultsObj;
    }

    function isValidDate(dateString) {
        let d = new Date(dateString);
        return d instanceof Date && !isNaN(d);
    }

    function mapResults(results){
        let mappedResults = {
            startDate:null,
            endDate:null,
            teacher:null
        };
        results.forEach(result => {
            let foundStartName = startDateNames.find(name => name === result.name);
            let foundEndName = endDateNames.find(name => name === result.name);
            let foundTeacherName = teacherNames.find(name => name === result.name)
            if(foundStartName){

                mappedResults.startDate = isValidDate(result.result) ? result.result : null;
            }
            else if(foundEndName){
                mappedResults.endDate = isValidDate(result.result) ? result.result : null;
            }
            else if(foundTeacherName){
                mappedResults.teacher = result.result;
            }
        });

        return mappedResults;
    }

    function GetUrlFilters(props){
        const {location,...passThroughProps} = props;
        let {search} = location;
        let mappedResults = {
            startDate:null,
            endDate:null,
            teacher:null
        };
        if(search){
            const targetParams = startDateNames.concat(endDateNames).concat(teacherNames);
            let results = targetParams.map(name => {
                return parseQuery(search,name);
            });
            results = results.filter(result => result.result);
            mappedResults = mapResults(results); 
        }
        console.log('results: ',mappedResults);
        return <Component teacher={mappedResults.teacher} startDate={mappedResults.startDate} endDate={mappedResults.endDate} {...passThroughProps} />;
    }

    return withRouter(GetUrlFilters);
}