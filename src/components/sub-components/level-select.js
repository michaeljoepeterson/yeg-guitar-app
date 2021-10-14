import React, {useState} from 'react';
import Box from '@material-ui/core/Box';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

export default function LevelSelect(props){
    const [selectedLevel, setSelectedLevel] = useState(props.level);
    let {user} = props;
    let levels = [
        {
            level:0,
            name:'Super Admin'
        },
        {
            level:1,
            name:'Admin'
        },
        {
            level:2,
            name:'Teacher'
        }
    ];

    const handleChange = (event) => {
        setSelectedLevel(event?.target.value);
        if(props.levelChanged){
            props.levelChanged(event?.target.value,user);
        }
    }

    let select = null;

    if(selectedLevel === levels[0]?.level){
        select = (
            <p>Super Admin</p>
        );
    }
    else{
        select = (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <InputLabel id="demo-simple-select-label">Level</InputLabel>
                <Select
                labelId="level-select"
                id="level-select"
                value={selectedLevel}
                label="Level"
                onChange={handleChange}
                >
                    {
                        levels.map((level) => {
                            if(level.level == 0){
                                return null;
                            }

                            return (
                                <MenuItem key={level.name} value={level.level}>{level.name}</MenuItem>
                            );
                        })
                    }
                </Select>
            </FormControl>
        </Box>
        )
    }

    return(
        <div>
            {select}
        </div>
    )
}
