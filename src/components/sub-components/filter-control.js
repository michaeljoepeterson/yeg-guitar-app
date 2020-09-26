import React from 'react';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

export default function FilterControl(props){
    const removeCopies = (responses) => {
        let foundResponses = {};
        let filteredResponses = responses.filter(resp => {
            if(!foundResponses[resp[props.target]]){
                foundResponses[resp[props.target]] = resp[props.target];
                return resp;
            }
        });

        return filteredResponses;
    }

    const filterChanged = (event,newValue) =>{
        props.filterChanged(newValue,props.target,props.changeData);
    }
    
    const buildFilter = () => {
        let copiedResponses = props.responses.filter(resp => {
            //if(!resp.hide){
                return resp;
            //}
        });
        let filteredResponses = removeCopies(copiedResponses);
        const filter = !props.value ?(
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
                value={ props.value? props.value : ''}
                renderInput={(params) => <TextField {...params} label={props.title ? props.title : props.target} variant="outlined" style = {{width: '100%'}}
                />}
                />
        );
        console.log(props.value);
        return filter
    }

    const filter = buildFilter();

    return(
        <div className="filter-container">
            {filter}
        </div>
    );
}