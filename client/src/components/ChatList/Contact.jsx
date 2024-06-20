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
    const senderId = latestMessage?.sender?._id;
    const senderName = latestMessage?.sender?.username;
    const type = latestMessage?.messageType;
    const roomType = chat?.roomType;

    if (type === "text") {
      return `${senderId === userId ? "You" : senderName}: ${latestMessage.message}`
    } else if (type === "image") {
      return `${senderId === userId ? "You" : senderName} sent an image.`
    } else if (type === "video") {
      return `$${senderId === userId ? "You" : senderName} sent a video.`
    } else if (type === "voice") {
      return `$${senderId === userId ? "You" : senderName} sent a voice note.`
    } else if (type === "document") {
      return `$${senderId === userId ? "You" : senderName} sent a file.`
    } else if (type === "like") {
      return `${senderId === userId ? "You" : senderName}: 👍`
    } else if (type === "call") {
      return ""
    }
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