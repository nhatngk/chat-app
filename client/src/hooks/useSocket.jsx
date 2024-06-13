import { useEffect } from "react";
import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const server = "http://localhost:5000";
let socket;

const useSocket = () => {
  const userId = useSelector(state => state.user.currentUser?.id);

  useEffect(() => {
    if (userId && !socket) {
      socket = io(server);

      return () => {
        socket.disconnect();
        console.log("Socket disconnected");
      };
    }
  }, [userId]);

  const socketEmit = (action, payload, fn) => {
    if (socket) {
      socket.emit(action, payload, fn);
    }
  };

  const socketListen = (action, fn) => {
    if (socket) {
      socket.on(action, fn);
    }
  };

  return { socketEmit, socketListen, userId, socket };
};

export default useSocket;
