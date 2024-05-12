import { useState } from "react";
import SendMessage from "~/assets/svg/SendMessage";
import Like from "~/assets/svg/Like";
import EmojiPickerButton from "~/assets/svg/EmojiPickerButton";
import Attach from "~/assets/svg/Attach";
import Voice from "~/assets/svg/Voice";
import EmojiPicker from "emoji-picker-react";

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
            <div className={`flex items-center`}>
                <div className={`mx-1 ${isMultiLine ? "mb-[6px]" : ""}`}>
                    <Attach />
                </div>

                <div className={`mx-1 ${isMultiLine ? "mb-[6px]" : ""}`}>
                    <Voice />
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

                <div className="absolute bottom-[16px] right-0 translate-y-[50%] mx-1" >
                    <button onClick={handlePickEmoji} className="relative" >
                        <EmojiPickerButton />
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
                                previewConfig ={{
                                    showPreview: false
                                }}
                            />
                        </div>
                    </button>
                </div>
            </div>

            <div className="flex">
                {
                    data?.message ? (
                        <div className={` ${isMultiLine ? "mb-[8px]" : ""}`}>
                            <SendMessage />
                        </div>
                    ) : (
                        <Like />)
                }
            </div>
        </div>
    )
}

export default Footer