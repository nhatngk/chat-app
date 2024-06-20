import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import EmojiPicker from "emoji-picker-react";
import SendMessage from "~/assets/svg/SendMessage";
import Like from "~/assets/svg/Like";
import EmojiPickerButton from "~/assets/svg/EmojiPickerButton";
import Attach from "~/assets/svg/Attach";
import Voice from "~/assets/svg/Voice";
import HoverInfo from "../HoverInfo";
import useSocket from "~/hooks/useSocket";

const Footer = () => {
    const textareaRef = useRef(null);
    const [isMultiLine, setIsMultiLine] = useState(false);
    const [open, setOpen] = useState(false);
    const [data, setData] = useState(null);
    const { socketEmit, userId } = useSocket();
    const chatRoomId = useSelector((state) => state.chat.currentChatRoom);

    const handleOnChange = (e) => {
        setData((prev) => ({ ...prev, text: e.target.value }));
        e.target.style.height = 'auto';
        const newHeight = e.target.scrollHeight;
        e.target.style.height = e.target.scrollHeight + 'px';
        setIsMultiLine(newHeight > 30);
    }

    const handleToggleEmojiPicker = () => {
        setOpen(!open);
    }

    const handlePickEmoji = (emoji) => {
        setData((prev) => ({ ...prev, text: (prev?.text ?? "") + emoji.emoji }));
    }

    const handleOnKeyDown = (e) => {
        if (e.key === "Enter") {
            handleOnSubmit(e);
        }
    }

    const handleOnClickLike = (e) => {
        e.preventDefault();
        socketEmit("sendMessage", {
            sender: userId,
            messageType: "like",
        },
            chatRoomId
        );
    }

    const handleOnSubmit = (e) => {
        e.preventDefault();
        if (!data) return;
        socketEmit("sendMessage", {
            sender: userId,
            messageType: "text",
            message: data?.text,
        },
            chatRoomId
        );
        setData(null);
        setIsMultiLine(false);
        textareaRef.current.style.height = 'auto';
    }

    useEffect(() => {
        setData(null);
        setIsMultiLine(false);
        textareaRef.current.style.height = 'auto';
    }, [chatRoomId])

    useEffect(() => {
        if (data?.text) {
            console.log(data?.text) 
            socketEmit("typing", userId, chatRoomId);
        }
    }, [data?.text])

    return (
        <div className={`flex flex-row px-3 pb-[10px] pt-1 w-full bottom-0 ${isMultiLine ? "items-end" : "items-center"}`}>
            <div className="flex items-center">
                <div className={`hover-circle size-9 flex items-center justify-center ${isMultiLine ? "mb-[2px]" : ""}`}>
                    <div className="parent">
                        <Attach />
                        <HoverInfo text="Attach file" direction="top" />
                    </div>
                </div>

                <div className={`hover-circle size-9 flex items-center justify-center ${isMultiLine ? "mb-[2px]" : ""} `}>
                    <div className="parent">
                        <Voice />
                        <HoverInfo text="Voice" direction="top" />
                    </div>
                </div>
            </div>

            <form
                onSubmit={handleOnSubmit}
                className="w-full flex flex-row relative mx-2 bg-[#f0f2f5] rounded-3xl p-2"
            >
                <textarea
                    ref={textareaRef}
                    onChange={handleOnChange}
                    onKeyDown={handleOnKeyDown}
                    value={data?.text || ""}
                    rows="1" cols="50"
                    placeholder="Aa"
                    className={`max-h-36 resize-none w-full mx-3 mr-6 pr-2 outline-none bg-[#f0f2f5] overflow-auto "}`}
                />

                <div className={`absolute right-0 translate-y-[50%] ${isMultiLine ? "bottom-5" : "bottom-[50%] "} `}>
                    <div onClick={handleToggleEmojiPicker} className="relative hover-circle size-8  flex items-center justify-center hover:bg-[#c2bbbb]" >
                        <div className="parent">
                            <EmojiPickerButton />
                            <HoverInfo text="Pick emoji" direction="top" />
                        </div>
                        <div className="absolute top-[-320px] right-[0px]">
                            <EmojiPicker
                                open={open}
                                onEmojiClick={handlePickEmoji}
                                width={300}
                                height={300}
                                rows={5}
                                perRow={8}
                                emojiSize={20}
                                emojiStyle="facebook"
                                previewConfig={{
                                    showPreview: false
                                }}
                            />
                        </div>
                    </div>
                </div>
            </form>

            <div className="">
                {
                    data?.text ? (
                        <div onClick={handleOnSubmit}
                            className={`${isMultiLine ? "mb-[2px]" : ""} hover-circle size-9 flex items-center justify-center `}
                        >
                            <div className="parent">
                                <SendMessage />
                                <HoverInfo text="Press to send" direction="top-left" />
                            </div>

                        </div>
                    ) : (
                        <div className="hover-circle size-9 flex items-center justify-center" onClick={handleOnClickLike}>
                            <div className="parent ">
                                <Like />
                                <HoverInfo text="Send like" direction="top-left" />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Footer