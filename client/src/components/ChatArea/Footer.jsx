import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { notifyError } from "~/utils/toastify";
import { upload } from "~/api/uploadApi";
import EmojiPicker from "emoji-picker-react";
import SendMessage from "~/assets/svg/SendMessage";
import Like from "~/assets/svg/Like";
import EmojiPickerButton from "~/assets/svg/EmojiPickerButton";
import Attach from "~/assets/svg/Attach";
import Voice from "~/assets/svg/Voice";
import HoverInfo from "../HoverInfo";
import useSocket from "~/hooks/useSocket";
import FilePreview from "./FilePreview";

const Footer = () => {
    const textareaRef = useRef(null);
    const fileInputRef = useRef(null);
    const [expand, setExpand] = useState(false);
    const [open, setOpen] = useState(false);
    const [fileInputKey, setFileInputKey] = useState(Date.now());
    const [data, setData] = useState({ text: null, files: [] });
    const { socketEmit, userId } = useSocket();
    const chatRoomId = useSelector((state) => state.chat.currentChatRoom);
    const handleOnChange = (e) => {
        setData((prev) => ({ ...prev, text: e.target.value }));
        e.target.style.height = 'auto';
        const newHeight = e.target.scrollHeight;
        e.target.style.height = e.target.scrollHeight + 'px';
        if (!expand) setExpand(newHeight > 30);
    }

    const handleToggleEmojiPicker = () => {
        setOpen(prev => !prev);
    }

    const handlePickEmoji = (emoji) => {
        setData((prev) => ({ ...prev, text: (prev?.text ?? "") + emoji.emoji }));
        setOpen(false);
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
        if (!data.text && !data.files.length) return;

        if (data.text) {
            socketEmit("sendMessage", {
                sender: userId,
                messageType: "text",
                message: data.text,
            },
                chatRoomId
            );
        }
        if(data.files.length) {
            data.files.forEach(async (file) => {
                try {
                    const response = await upload(file);
                    if(file.type.startsWith("image/")) {
                        socketEmit("sendMessage", {
                            sender: userId,
                            messageType: "image",
                            imageUrl: response.url,
                        },
                            chatRoomId
                        );
                    }
                    
                    if(file.type.startsWith("video/")) {
                        socketEmit("sendMessage", {
                            sender: userId,
                            messageType: "video",
                            videoUrl: response.url,
                        },
                            chatRoomId
                        );
                    }
                } catch (error) {
                    console.log(error);
                }

            })
        }

        setData({ text: null, files: [] });
        setOpen(false);
        textareaRef.current.style.height = 'auto';
    }

    const handleFileChange = (e) => {
        const validFiles = Array.from(e.target.files).filter(file => file.size <= 25 * 1024 * 1024);
        if (validFiles.length < e.target.files.length) {
            notifyError("Max file size is 25MB");
        }
        setData((prev) => ({ ...prev, files: [...prev.files, ...validFiles] }));
        setExpand(true);
        setFileInputKey(Date.now());
    };

    useEffect(() => {
        setData({ text: null, files: [] });
        setExpand(false);
        textareaRef.current.style.height = 'auto';
    }, [chatRoomId])

    useEffect(() => {
        if (data.text) {
            socketEmit("typing", userId, chatRoomId);
        }
    }, [data.text])

    useEffect(() => {
        if (!data.files.length && !data.text) {
            setExpand(false);
        }
    }, [data])

    return (
        <div className={`flex flex-row px-3 pb-[10px] pt-1 w-full bottom-0 ${expand ? "items-end" : "items-center"}`}>
            <div className="flex items-center">
                <div className={`hover-circle size-9 flex items-center justify-center ${expand ? "mb-[2px]" : ""}`}>
                    <label htmlFor="file" className="parent relative">
                        <Attach />
                        <HoverInfo text="Attach file" direction="top" />
                    </label>
                    <input key={fileInputKey} id="file" type="file" encType="multipart/form-data"
                    ref={fileInputRef} onChange={handleFileChange} className="hidden" multiple />
                </div>

                <div className={`hover-circle size-9 flex items-center justify-center ${expand ? "mb-[2px]" : ""} `}>
                    <div className="parent">
                        <Voice />
                        <HoverInfo text="Voice" direction="top" />
                    </div>
                </div>
            </div>

            <div className="w-full flex flex-col mx-2 bg-[#f0f2f5] rounded-3xl p-2 relative">
                {
                    !!data.files.length && (
                        <div className="p-2 mb-2 flex gap-3">
                            {data?.files?.map((file, index) => {
                                return (
                                    <FilePreview
                                        index={index}
                                        key={file.name}
                                        setData={setData}
                                        file={file}
                                        setFileInputKey={setFileInputKey}
                                    />
                                )
                            })}
                        </div>
                    )
                }

                <form
                    onSubmit={handleOnSubmit}
                    className="relative flex w-full flex-1 items-center"
                >
                    <textarea
                        ref={textareaRef}
                        onChange={handleOnChange}
                        onKeyDown={handleOnKeyDown}
                        value={data?.text || ""}
                        rows="1" cols="50"
                        placeholder="Aa"
                        className={`max-h-36 resize-none ml-2 mr-7 w-full outline-none bg-[#f0f2f5] overflow-auto "}`}
                    />

                    <div className={`absolute right-0 translate-y-[50%] ${expand ? "bottom-5" : "bottom-[50%] "} `}>
                        <div onClick={handleToggleEmojiPicker} className="relative hover-circle size-8 flex items-center justify-center hover:bg-[#c2bbbb]" >
                            <div className="parent">
                                <EmojiPickerButton />
                                <HoverInfo text="Pick emoji" direction="top" />
                            </div>
                            <div className="absolute top-[-320px] right-[0px]">
                                <EmojiPicker
                                    lazyLoadEmojis={true}
                                    open={open}
                                    onEmojiClick={handlePickEmoji}
                                    width={300}
                                    height={300}
                                    rows={5}
                                    perRow={8}
                                    emojiSize={16}
                                    emojiStyle="facebook"
                                    previewConfig={{
                                        showPreview: false
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                </form>
            </div>

            {
                (data?.text || data?.files?.length) ? (
                    <div onClick={handleOnSubmit}
                        className={`${expand ? "mb-[2px]" : ""} hover-circle size-9 flex items-center justify-center `}
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
    )
}

export default Footer