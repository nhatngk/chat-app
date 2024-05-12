import { Link } from "react-router-dom";
import Avatar from "./Avatar";

const truncateString = (inputStr) => {
  if (inputStr.length > 30) {
    return inputStr.slice(0, 30) + "...";
  } else {
    return inputStr;
  }
}

const Contact = () => {
  return (
    <Link to={"#"}  className="flex bg-white p-[10px] rounded-xl hover:bg-[#f1f1f1]">
      <div className="relative">
        <Avatar srcImg="https://res.cloudinary.com/dyapfpkgr/image/upload/v1715022080/Chat-app/download_b5rilg.jpg" size="12" />

        <span className="absolute z-50 right-0 bottom-0 border-2 border-solid border-white bg-[#5ad539] rounded-full w-[14px] h-[14px]"></span>
      </div>


      <div className="pl-[10px] flex flex-col ">
        <span className="font-medium">Name</span>
        <div>
          <span className="text-sm text-[#65676B]">
            {truncateString("Lorem ipsum dolor sit amet consectetur")}
          </span>
          <span> · </span>
          <span className="text-sm text-[#65676B]">1 day</span>
        </div>
      </div>
    </Link>
  )
}

export default Contact