import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import { MuiPickersUtilsProvider,KeyboardDatePicker } from '@material-ui/pickers';

export default function DatePicker(props){

    return(
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
        <KeyboardDatePicker
            margin={props.margin ? props.margin : "normal"}
            label={props.label}
            format={props.format ? props.format : "MM/dd/yyyy"}
            value={props.dateVal}
            onChange={(e) => props.dateUpdated(e,props.target)}
            KeyboardButtonProps={{
                'aria-label': 'change date',
            }}
            required={props.required ? props.required : true}
        />
    </MuiPickersUtilsProvider>
    )
}