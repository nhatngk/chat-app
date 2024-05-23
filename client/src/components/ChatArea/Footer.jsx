import { useState } from "react";
import EmojiPicker from "emoji-picker-react";
import SendMessage from "~/assets/svg/SendMessage";
import Like from "~/assets/svg/Like";
import EmojiPickerButton from "~/assets/svg/EmojiPickerButton";
import Attach from "~/assets/svg/Attach";
import Voice from "~/assets/svg/Voice";
import HoverInfo from "../HoverInfo";


const Footer = () => {
    const [isOverflow, setIsOverflow] = useState(false);
    const [isMultiLine, setIsMultiLine] = useState(false);
    const [isPickingEmoji, setIsPickingEmoji] = useState(false);
    const [data, setData] = useState(null);

    const handleOnChange = (e) => {
        setData({ ...data, message: e.target.value });
        e.target.style.height = 'auto';
        const newHeight = e.target.scrollHeight;
        setIsMultiLine(newHeight > 30);
        setIsOverflow(newHeight > 144);
        e.target.style.height = e.target.scrollHeight + 'px';
    }

    const handlePickEmoji = () => {
        setIsPickingEmoji(!isPickingEmoji);
    }

    return (
        <div className={`flex flex-row px-3 py-[10px] w-full absolute bottom-0  ${isMultiLine ? "items-end" : "items-center"}`}>
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

            <div className="w-full flex flex-row relative mx-2 bg-[#f0f2f5] rounded-3xl p-2">
                <textarea
                    onChange={handleOnChange}
                    rows="1" cols="50"
                    placeholder="Aa"
                    className={`max-h-36 resize-none w-full mx-6 outline-none bg-[#f0f2f5] 
                        ${isOverflow ? "overflow-y-scroll" : "overflow-hidden"}`}
                />

                <div className={`absolute right-0 translate-y-[50%] ${isMultiLine ? "bottom-5" : "bottom-[50%] "} `}>
                    <button onClick={handlePickEmoji} className="relative hover-circle size-8  flex items-center justify-center hover:bg-[#c2bbbb]" >
                        <div className="parent">
                            <EmojiPickerButton />
                            <HoverInfo text="Pick emoji" direction="top" />
                        </div>
                        <div className="absolute top-[-320px] right-[0px]">
                            <EmojiPicker
                                open={isPickingEmoji}
                                // onEmojiSelect={handleEmojiSelect}
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
                    </button>
                </div>
            </div>

            <div className="">
                {
                    data?.message ? (
                        <div className={`${isMultiLine ? "mb-[2px]" : ""} hover-circle size-9 flex items-center justify-center `}>
                            <div className="parent">
                                <SendMessage />
                                <HoverInfo text="Press to send" direction="send" />
                            </div>

                        </div>
                    ) : (
                        <div className="hover-circle size-9 flex items-center justify-center ">
                            <div className="parent ">
                                <Like />
                                <HoverInfo text="Send like" direction="send" />
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Footer