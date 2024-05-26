import Header from "./Header"
import Conversation from "./Conversation"
import Footer from "./Footer"

const ChatArea = () => {
  return (
    <div className="h-full flex flex-col w-full"> 
        <Header />
        <Conversation />
        <Footer />
    </div>
  )
}

export default ChatArea