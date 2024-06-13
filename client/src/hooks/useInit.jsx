import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import useSocket from './useSocket';
import useFriends from './useFriends';
const useInit = () => {
    const dispatch = useDispatch();
    const { socketEmit, userId } = useSocket();
    const { loading, error } = useFriends();

    useEffect(() => {
        if(userId) {
            socketEmit('online', userId);
        }
    }, []);

    return { loading, error };
};

export default useInit;
