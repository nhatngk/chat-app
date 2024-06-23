import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setShowMedia } from "~/store/showMediaSlice";
import CloseButton from "~/assets/svg/CloseButton";
const ShowMedia = () => {
    const dispatch = useDispatch();
    const showMedia = useSelector(state => state.showMedia);
    const handleOnclose = () => {
        dispatch(setShowMedia({ isShow: false, type: null, url: null }));
    }

    return (
        <div className="fixed inset-0 z-100">
            <div className="relative bg-[#1f1e1e] w-full h-full flex-center">
                {
                    showMedia.type === "image" ? (
                        <img src={showMedia.url} alt="image" className="w-[90%] h-[90%] object-cover" />
                    ) : (
                        <video src={showMedia.url} autoPlay controls className="w-[90%] h-[90%] object-cover" />
                    )
                }

                <div onClick={handleOnclose}
                    className="absolute top-4 right-4 text-white rounded-full p-[6px] bg-[#534a4a] hover:bg-[#918787]">
                    <CloseButton />
                </div>
            </div>
        </div>
    )
}

export default ShowMedia