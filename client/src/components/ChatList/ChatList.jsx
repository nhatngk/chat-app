import { useSelector } from "react-redux";

import Search from "./Search";
import Contact from "./Contact";

const ChatList = () => {
  const { currentUser } = useSelector(state => state.user)

  return (
    <div className="max-h-full min-w-96 bg-slate p-4 pb-0 border-r-[1px] border-solid border-blur">
      <h1>Chats</h1>
      <Search />
      <div className="mt-4 overflow-y-scroll max-h-[calc(100vh-120px)]">
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
        <Contact />
      </div>
    </div>
  )
}


export default ChatList