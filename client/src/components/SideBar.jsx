import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import Avatar from "./Avatar";
import { signOut } from "~/api/userApi";
import { setUser } from "~/store/user/userSlice";

const SideBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSignout = async () =>{
    try {
      const response = await signOut();
      dispatch(setUser(null));
      navigate("/sign-in", { replace: true });
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="w-24 flex flex-col-reverse items-center border-r-[1px] border-solid border-[#f1f1f1]">
      <button type="button" className="my-2" onClick={handleSignout}>
        <i className="fa-solid fa-right-from-bracket size-9"></i>
      </button>

      <button type="button" className="my-2">
      <Avatar srcImg="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg" size="9" />
      </button>
    </div>
  )
}

export default SideBar