import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { chatActions } from "~/store/chatSlice";
import useSocket from "~/hooks/useSocket";
import Header from "./Header";
import Conversation from "./Conversation";
import Footer from "./Footer";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { socket, socketListen, userId } = useSocket();
  const [members, setMembers] = useState([]);
  const [typingList, setTypingList] = useState([]);
  const currentChatRooom = useParams().room;
  const chatRoom = useSelector(state => state.chat.chatRooms.find(chatRoom => chatRoom._id === currentChatRooom));
  
  const typingTimeouts = useRef({}); 

  useEffect(() => {
    const handleTyping = (userTyping, chatRoomId) => {
      if (chatRoomId === currentChatRooom && userTyping !== userId) {
        if (typingTimeouts.current[userTyping]) {
          clearTimeout(typingTimeouts.current[userTyping]);
        }

        setTypingList(prev => {
          if (!prev.some(user => user._id === userTyping)) {
            const user = members.find(member => member._id === userTyping);
            if (!user) return prev;
            return [...prev, user];
          }
          return prev;
        });

        typingTimeouts.current[userTyping] = setTimeout(() => {
          setTypingList(prev => prev.filter(user => user._id !== userTyping));
        }, 1000);
      }
    };

    socketListen("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping);
      Object.values(typingTimeouts.current).forEach(timeout => clearTimeout(timeout));
    };
  }, [members, currentChatRooom, userId, socketListen]);

  useEffect(() => {
    dispatch(chatActions.setCurrentChatRoom(currentChatRooom));
  }, [currentChatRooom, dispatch]);

  useEffect(() => {
    setMembers(chatRoom?.members || []);
  }, [chatRoom]);

  return (
    <div className="h-full flex-1 flex flex-col">
      <Header />
      <Conversation typingList={typingList} />
      <Footer />
    </div>
  );
};

export default ChatArea;
