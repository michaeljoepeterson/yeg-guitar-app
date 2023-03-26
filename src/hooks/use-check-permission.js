import { useSelector } from "react-redux";
import { useHistory } from "react-router";

export const useCheckPermission = (level) => {
    const {currentUser, loading, error} = useSelector((state) => state.auth);
    const history = useHistory();

    if(!loading && currentUser?.level > level){
        history.push('/');
    }

    return {
        loading
    };
}

export default useCheckPermission;