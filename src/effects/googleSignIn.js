import React, {useEffect,useState} from 'react';
import fb from '../fb/firebase';

export const useGoogleRefresh = (dispatch,stopRefresh) =>{
    const refreshTime = 5000;
    
    const [time,useSetTime] = useState(null);
    const [token,useSetToken] = useState(0);
    const refresh = setInterval(
        () => {
            let currentTime = time;
            currentTime += refreshTime;
            useSetTime(currentTime);
        },
        refreshTime
    );
    useEffect(() => {
        const getToken = async () =>{
            console.log('getting g token');
            let token = await fb.getToken();
            //dispatch token
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
