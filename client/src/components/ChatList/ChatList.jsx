import { useSelector } from "react-redux";

import Search from "./Search";
import Contact from "./Contact";

const ChatList = () => {

  return (
    <div className="flex flex-col min-w-96 p-4 pb-0 border-r-[1px] border-solid border-blur">
      <h1>Chats</h1>
      <Search />
      <div className="mt-4 overflow-y-auto flex-1 pr-1">
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