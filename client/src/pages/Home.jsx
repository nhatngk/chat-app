import { useState } from "react";
import ChatArea from "~/components/ChatArea/ChatArea";
import ChatList from "~/components/ChatList/ChatList";
import ProfileModal from "~/components/Sidebar/ProfileModal/ProfileModal";
import FriendModal from "~/components/Sidebar/FriendModal/FriendModal";
import SideBar from "~/components/Sidebar/SideBar";

const Home = () => {
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showFriendModal, setShowFriendModal] = useState(false);
  return (
    <div className="h-screen flex">
      <SideBar setShowProfileModal={setShowProfileModal} setShowFriendModal={setShowFriendModal}  />
      <ChatList />
      <ChatArea />
      {showFriendModal && <FriendModal setShowFriendModal={setShowFriendModal} />}
      {showProfileModal && <ProfileModal setShowProfileModal={setShowProfileModal} />}
    </div>
  )
}

export default Home