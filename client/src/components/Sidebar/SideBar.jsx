import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import Avatar from "../Avatar";
import Logout from "~/assets/svg/Logout";
import Friends from "~/assets/svg/Friends";
import { signOut } from "~/api/userApi";
import { setUser } from "~/store/userSlice";

const SideBar = (props) => {
  const { setShowProfileModal, setShowFriendModal } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnClickProfile = () => {
    setShowProfileModal(true);
  }
  const handleOnClickFriend = () => {
    setShowFriendModal(true);
  }

  const handleSignout = async () => {
    try {
      await signOut();
      dispatch(setUser(null));
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-24 flex flex-col justify-between border-r-[1px] border-solid border-blur">

      <div className="flex flex-col items-center justify-center">
        <button
          className="mt-1 p-3 rounded-lg flex justify-center hover:bg-blur"
          type="button"
          onClick={handleOnClickFriend}
        >
          <Friends />
        </button>
      </div>

      <div className="flex flex-col items-center mb-4">
        <button type="button" className="my-2" onClick={handleOnClickProfile}>
          <Avatar
            srcImg="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg"
            size="9" />
        </button>

        <button
          className="text-disable"
          type="button"
          onClick={handleSignout}>
          <Logout />
        </button>
      </div>
    </div>
  )
}

export default SideBar