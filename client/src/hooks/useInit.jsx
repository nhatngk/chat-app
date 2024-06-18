import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import useSocket from './useSocket';
import useFriends from './useFriends';
import { chatActions } from '~/store/chatSlice';
const useInit = () => {
    const dispatch = useDispatch();
    const { socketEmit, socketListen, userId, socket } = useSocket();
    const { loading, error } = useFriends();

    useEffect(() => {
        if (userId) {
            socket.connect();
            socketEmit('online', userId);
            socketListen('online', (userId) => {
                dispatch(chatActions.setOnlineUser(userId));
            })
            socketListen('chatRooms', (chatRooms) => {
                dispatch(chatActions.setChatRooms(chatRooms));
            });
            socketListen('offline', (userId, time) => {
                dispatch(chatActions.setOfflineUser({ userId, time }));
            })
            socketListen('message', ({ chatRoomId, message }, callback) => {
                dispatch(chatActions.addMessage({ chatRoomId, message }));
                callback(userId);
            })
        }

        return () => {
            socket.disconnect();
        }
    }, [userId]);

    return { socket, loading };
};

export default useInit;
