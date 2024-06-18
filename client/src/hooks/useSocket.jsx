import { useSelector } from "react-redux";
import { io } from "socket.io-client";

const server = "http://localhost:5000";
const socket = io(server);

const useSocket = () => {
  const userId = useSelector(state => state.user.currentUser?.id);

  const socketEmit = (action, payload, fn) => {
    socket.emit(action, payload, fn);
  };

  const socketListen = (action, fn) => {
      socket.on(action, fn);
  };

  return { socketEmit, socketListen, userId, socket };
};

export default useSocket;
