import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import './styles/search-filters.css';

export default function FilterControl(props){
    const removeCopies = (responses) => {
        let foundResponses = {};
        let filteredResponses = responses.filter(resp => {
            if(props.activeProp && !resp[props.activeProp]){
                return false;
            }
            if(!foundResponses[resp[props.target]]){
                foundResponses[resp[props.target]] = resp[props.target];
                return true;
            }
            else{
                return false;
            }
        });
        return filteredResponses;
    }

    const filterChanged = (event,newValue) =>{
        try{
            props.filterChanged(newValue,props.target,props.changeData);
        }
        catch(e){
            throw e;
        }
    }
    
    const buildFilter = () => {
        let copiedResponses = props.responses.filter(resp => {
            //if(!resp.hide){
                return resp;
            //}
        });
        let filteredResponses = removeCopies(copiedResponses);
        console.log('filtered responses: ',filteredResponses)
        const filter = !props.value && !props.ignoreEmpty ?(
            <Autocomplete
                onChange={(e,newValue) => filterChanged(e,newValue) }
                options={filteredResponses}
                getOptionLabel={(option) => option[props.target] ? option[props.target] : ''}
                style={{ maxWidth: 300 }}
                renderInput={(params) => <TextField {...params} label={props.title ? props.title : props.target} variant="outlined" style = {{width: '100%'}}
                />}
                />
        ) :(
            <Autocomplete
                onChange={(e,newValue) => filterChanged(e,newValue) }
                options={filteredResponses}
                getOptionLabel={(option) => option[props.target] ? option[props.target] : ''}
                style={{ maxWidth: 300 }}
                value={ props.value? props.value : null}
                renderInput={(params) => <TextField {...params} label={props.title ? props.title : props.target} 
                variant="outlined" style = {{width: '100%'}}
                />}
                />
        );
        return filter
    }

    const filter = buildFilter();

    return(
        <div className="filter-container">
            {filter}
        </div>
    );
}