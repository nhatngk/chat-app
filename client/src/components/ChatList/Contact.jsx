import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import Avatar from "../Avatar";
import { useState } from "react";
import { useEffect } from "react";
import { formatTimeAgo } from "~/utils/handleTime";

const Contact = ({ chat }) => {
  const [timeAgo, setTimeAgo] = useState();
  const userId = useSelector((state) => state.user.currentUser?.id);
  const friend = chat.roomType === "private" && chat.members.find(member => member._id.toString() !== userId.toString());
  const latestMessage = chat?.latestMessage;
  const unread = chat?.unreadMembers?.includes(userId);
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);

  useEffect(() => { 
    if (latestMessage) {
      setTimeAgo(formatTimeAgo(latestMessage.timeSent));
    }
    const interval = setInterval(() => {
      setTimeAgo(formatTimeAgo(latestMessage.timeSent));
    },60 * 1000)
    return () => clearInterval(interval);
  }, [latestMessage])

  const render = (latestMessage) => {
    const sender = latestMessage?.sender?.username;
    const type = latestMessage?.messageType;
    const roomType = chat?.roomType;

    if (type === "text") {
      return `${sender === userId ? "You: " : (roomType === "private" ? "" : sender + ": ")}${latestMessage.message}`
    } else if (type === "image") {
      return `${sender === userId ? "You" : sender} sent an image.`
    } else if (type === "video") {
      return `$${sender === userId ? "You" : sender} sent a video.`
    } else if (type === "voice") {
      return `$${sender === userId ? "You" : sender} sent a voice note.`
    } else if (type === "document") {
      return `$${sender === userId ? "You" : sender} sent a file.`
    } else if (type === "like") {
      return
    } else if (type === "call") {
      return ""
    }

    return ""
  }


  return (
    <Link to={"/chat/" + chat._id + "/"}
      className={`flex ${currentChatRoom === chat._id ? "bg-blur" : "bg-white"} p-[10px] rounded-xl hover:bg-blur  `}>
      {chat.roomType === "private" ? (
        <div className="relative">
          <Avatar size='12' srcImg={`${friend.avatar}`} />
          {
            friend?.status?.online && (
              <span className="absolute z-50 right-0 bottom-0 border-2 border-solid border-white bg-[#5ad539] rounded-full w-[14px] h-[14px]"></span>
            )
          }
        </div>
      ) : (
        <div>
          <div className="relative size-12 rounded-full bg-[#fcfafa] flex items-center justify-center font-bold text-2xl">
            {chat.name[0].toUpperCase()}
          </div>

          {
            friend.status.online && (
              <span className="absolute z-50 right-0 bottom-0 border-2 border-solid border-white bg-[#5ad539] rounded-full w-[14px] h-[14px]"></span>
            )
          }
        </div>
      )
      }

      <div className="pl-[10px] flex flex-col max-w-[calc(100%-4rem) ">
        <p className="text-md font-semibold truncate">{chat.name}</p>
        <div className="text-xs flex">
          <p className={`truncate max-w-[70px] ${unread ? "text-[#050505] font-bold" : "text-[#65676B]"}`}>
            {render(latestMessage)}
          </p>
          {latestMessage && <p>{"  ·  "}</p>}
          <p className={` text-[#65676B]`}>{timeAgo}</p>
        </div>
      </div>
    </Link >
  )
}

export default Contact