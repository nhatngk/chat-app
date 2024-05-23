import { useState } from "react";
import ChatArea from "~/components/ChatArea/ChatArea";
import ChatList from "~/components/ChatList/ChatList";
import ProfileModal from "~/components/ProfileModal/ProfileModal";
import SideBar from "~/components/SideBar";

const Home = () => {
  const [showModal, setShowModal] = useState(false)
  return (
    <div className="h-screen flex flex-row">
      <SideBar setShowModal={setShowModal} />
      <ChatList />
      <ChatArea />
      {showModal && <ProfileModal setShowModal={setShowModal}/>}
    </div>
  )
}

export default Home