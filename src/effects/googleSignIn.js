import React, {useEffect,useState} from 'react';
import fb from '../fb/firebase';

export const useGoogleRefresh = (dispatch,stopRefresh) =>{
    const refreshTime = 5000;
    
    const [time,setTime] = useState(null);
    const [token,setToken] = useState(0);
    const refresh = setInterval(
        () => {
            let currentTime = time;
            currentTime += refreshTime;
            setTime(currentTime);
        },
        refreshTime
    );
    useEffect(() => {
        const getToken = async () =>{
            console.log('getting g token');
            let token = await fb.getToken();
            //dispatch token
            setToken(null)
        }

        getToken();

        return() => {
            console.log('clean up refresh');
            if(refresh){
                clearInterval(refresh);
            }
        }
    },[time]);
    //return token for use if needed
    if(stopRefresh){
        clearInterval(refresh);
    }
    return token;
}
