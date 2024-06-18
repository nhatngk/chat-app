import { useParams } from "react-router-dom"
import { useDispatch } from "react-redux"
import { chatActions } from "~/store/chatSlice"
import Header from "./Header"
import Conversation from "./Conversation"
import Footer from "./Footer"
import { useEffect } from "react"

const ChatArea = () => {
  const dispatch = useDispatch();
  const chatRoomId = useParams().room;
  useEffect(() => {
    dispatch(chatActions.setCurrentChatRoom(chatRoomId));
  },[chatRoomId])
  return (
    <div className="h-full flex-1 flex flex-col "> 
        <Header />
        <Conversation />
        <Footer />
    </div>
  )
}

export default ChatArea