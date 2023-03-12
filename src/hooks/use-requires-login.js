import { useSelector } from "react-redux";
import { useHistory } from "react-router";

export const useRequiresLogin = () =>{
    const {currentUser, loading, error} = useSelector((state) => state.auth);
    const loggedIn = currentUser !== null;
    const history = useHistory();
    if(!loading && (!loggedIn || error)){
        history.push('/');
    }
}

export default useRequiresLogin