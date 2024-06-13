import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setUser } from "../store/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { friendsAndRequests } from '../api/friendApi';
import { friendActions } from '../store/friendSlice';
const useFriends = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        let isMounted = true;
        const getFriendRequests = async () => {
            try {
                const response = await friendsAndRequests();
                dispatch(friendActions.setFriends(response.friends));
                dispatch(friendActions.setSentRequests(response.sentRequests));
                dispatch(friendActions.setReceivedRequests(response.receivedRequests));
            } catch (error) {
                if(error?.statusCode === 401) {
                    dispatch(setUser(null));
                    navigate("/sign-in", { replace: true }, { state: { from: location } });
                  }
            }
        }
        getFriendRequests();
        return () => { isMounted = false }
    }, []);

    return { loading, error };
}

export default useFriends
