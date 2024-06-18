import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import useInit from "~/hooks/useInit";
import Loading from "~/components/Loading";
import ChatList from "~/components/ChatList/ChatList";
import ProfileModal from "~/components/Sidebar/ProfileModal/ProfileModal";
import FriendModal from "~/components/Sidebar/FriendModal/FriendModal";
import SideBar from "~/components/Sidebar/SideBar";

const Home = () => {
  const { socket, loading } = useInit();
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);

  return (
    loading ? <Loading /> : (
      <div className="h-screen flex max-h-screen">
        <SideBar setShowProfileModal={setShowProfileModal} setShowFriendModal={setShowFriendModal} showFriendModal={showFriendModal} />
        <ChatList />
        <div className="flex-1">
          <Outlet />
        </div>
        {showFriendModal && <FriendModal setShowFriendModal={setShowFriendModal} />}
        {showProfileModal && <ProfileModal setShowProfileModal={setShowProfileModal} />}
      </div>
    )

  )
}

export default Home