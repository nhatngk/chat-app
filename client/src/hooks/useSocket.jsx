import { io } from "socket.io-client";
import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

const server = "http://localhost:5000";

const useSocket = () => {
  const socketRef = useRef(io(server));
  const userId = useSelector(state => state.user.currentUser?.id);

  useEffect(() => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
    socketRef.current = io(server);

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [userId]);

  const socketEmit = (action, payload, fn) => {
    socketRef.current.emit(action, payload, fn);
  };

  const socketListen = (action, fn) => {
    socketRef.current.on(action, fn);
  };

  return { socketEmit, socketListen, userId, socket: socketRef.current };
};

export default useSocket;
