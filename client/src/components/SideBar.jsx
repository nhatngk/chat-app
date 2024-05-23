import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import Avatar from "./Avatar";
import Logout from "~/assets/svg/Logout";
import { signOut } from "~/api/userApi";
import { setUser } from "~/store/user/userSlice";

const SideBar = (props) => {
  const { setShowModal } = props;
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleOnClickProfile = () => {
    setShowModal(true);
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
    <div className="w-24 flex flex-col-reverse items-center border-r-[1px] border-solid border-blur">
      <button className="hover-circle flex items-center justify-center size-9" type="button" onClick={handleSignout}>
          <Logout />
      </button>

      <button type="button" className="my-2" onClick={handleOnClickProfile}>
        <Avatar srcImg="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg" size="9" />
      </button>
    </div>
  )
}

export default SideBar