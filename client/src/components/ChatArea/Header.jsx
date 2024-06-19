import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Phone from "~/assets/svg/Phone";
import Camera from "~/assets/svg/Camera";
import Avatar from "../Avatar";
import HoverInfo from "../HoverInfo";
import { formatTimeAgo } from "~/utils/handleTime";

const Header = () => {
    const [timeAgo, setTimeAgo] = useState();
    const currentChatRoom = useSelector((state) => state.chat.currentChatRoom); 
    const chat = useSelector((state) => state.chat.chatRooms.find(chat => chat._id === currentChatRoom));
    const userId = useSelector((state) => state.user.currentUser?.id);
    const friend = chat?.roomType === "private" && chat.members.find(member => member._id.toString() !== userId.toString());

    useEffect(() => { 
        if (friend?.status?.lastSeen) {
          setTimeAgo(formatTimeAgo(friend?.status?.lastSeen));
        }

        const interval = setInterval(() => {
          setTimeAgo(formatTimeAgo(friend?.status?.lastSeen));
        },60 * 1000)
        return () => clearInterval(interval);
      }, [friend?.status?.lastSeen])
      
    return (
        <div className='flex flex-row items-center justify-between px-3 py-[4px] w-full shadow-[0_2px_2px_-1px_rgba(0,0,0,0.1)]'>
            <div className='flex hover:bg-blur p-2 rounded-xl'>
                <div className="relative">
                    <Avatar srcImg="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg" size="9" />
                    {
                        friend?.status?.online && (
                            <span className="absolute z-50 right-0 bottom-0 border-2 border-solid border-white bg-[#5ad539] rounded-full size-3"></span>
                        )
                    }
                </div>

                <div className='flex flex-col pl-2'>
                    <span className="text-[#050505] text-[18px] leading-none">{friend?.username}</span>
                    <span className="text-[#65676B] text-[16px] leading-none">
                        {friend?.status?.online ? "Online" : `Last seen ${timeAgo}`}
                    </span>
                </div>
            </div>

            <div className='flex gap-1'>
                <div className=" hover-circle size-9 flex items-center justify-center ">
                    <div className="parent">
                        <Phone />
                        <HoverInfo text="Call" direction="bottom" />
                    </div>
                </div>
                <div className="mr-2 hover-circle size-9 flex items-center justify-center">
                    <div className="parent">
                        <Camera />
                        <HoverInfo text="Video call" direction="bottom" />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Header