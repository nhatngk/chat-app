import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { chatActions } from "~/store/chatSlice"
import useSocket from "~/hooks/useSocket"
import Header from "./Header"
import Conversation from "./Conversation"
import Footer from "./Footer"

const ChatArea = () => {
  const dispatch = useDispatch();
  const { socket, socketListen, userId} = useSocket();
  const [typingList, setTypingList] = useState([]);
  const currentChatRooom = useParams().room;
  const members = useSelector(state => state.chat.chatRooms.find(chatRoom => chatRoom._id === currentChatRooom))?.members;
  useEffect(() => {
    let timeOut;
    socketListen("typing", (userTyping, chatRoomId) => {
      if (chatRoomId === currentChatRooom && userTyping !== userId) {
        clearTimeout(timeOut);
        setTypingList((prev) => {
          if (!prev.some(user => user._id === userTyping) ) {
            const user = members.find(member => member._id === userTyping);
            if(!user) return prev
            return [
              ...prev, 
              user
            ];
          }
          return prev;
        });

        timeOut = setTimeout(() => {
          setTypingList((prev) => prev.filter(user=> user._id !== userTyping));
        }, 1000)
      }
    })

    return () => {
      socket.off("typing");
      clearTimeout(timeOut);
    }
  }, [])

  useEffect(() => {
    dispatch(chatActions.setCurrentChatRoom(currentChatRooom));
  }, [currentChatRooom])

  return (
    <div className="h-full flex-1 flex flex-col relative">
      <Header />
      <Conversation typingList={typingList} />
      <Footer />
    </div>
  )
}

export default ChatArea