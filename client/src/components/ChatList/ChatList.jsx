import { useSelector } from "react-redux";

import Search from "./Search";
import Contact from "./Contact";

const ChatList = () => {
  const chatList = useSelector((state) => state.chat.chatRooms);

  return (
    <div className="flex flex-col  p-4 pb-0 border-r-[1px] border-solid border-blur">
      <h1>Chats</h1>
      <Search />
      <div className="mt-4 overflow-y-auto flex-1 pr-1">
        {
          chatList.length === 0
            ? (<p className="text-center">Please add friend to start chat </p>)
            : chatList.map((chat, index) => <Contact key={index} chat={chat} />)
        }
      </div>
    </div>
  )
}


export default ChatList