import ChatArea from "~/components/ChatArea/ChatArea"
import ChatList from "~/components/ChatList"
import SideBar from "~/components/SideBar"

const Home = () => {
  return (
    <div className="h-screen flex flex-row">
      <SideBar />
      <ChatList />
      <ChatArea />
    </div>
  )
}

export default Home