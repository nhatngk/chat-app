import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux"
import Message from "./Message"
import Loading from "../Loading";
import { getAllMessages } from "~/api/chatApi";
import { chatActions } from "~/store/chatSlice";

const Conversation = () => {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.currentUser?.id);
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);
  const conversation = useSelector((state) => state.chat.conversations).find(conversation => conversation.chatRoomId === currentChatRoom);
  const messages = conversation?.messages || [];

  useEffect(() => {
    let isMounted = true;
    const getMessages = async () => {
      try {
        if (!currentChatRoom) return
        setLoading(true);
        const response = await getAllMessages(currentChatRoom);
        dispatch(chatActions.addConversation({ chatRoomId: currentChatRoom, messages: response.messages }));
      } catch (error) {
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (!conversation) {
      getMessages();
    }

    return () => {
      isMounted = false
    }
  }, [currentChatRoom])

  if (loading) return (
    <div className="flex-1 relative">
      <Loading />
    </div>
  )

  return (
    <div className='flex flex-1 w-full flex-col py-2 px-4 gap-[2px] overflow-y-auto '>
      {
        !!messages.length && messages.map((message, index) => {
          let order = null;
          const direction = message.sender === userId ? 'send' : 'receive';
          const isFirst = index === 0 || messages[index - 1].sender !== message.sender;
          const isLast = index === messages.length - 1 || messages[index + 1].sender !== message.sender;

          if (isFirst && isLast) {
            order = 'single'
          } else if (isFirst) {
            order = 'first'
          } else if (isLast) {
            order = 'last'
          } else {
            order = 'middle'
          }

          return (
            <div className='flex justify-start parent' key={message._id}>
              <Message
                message={message}
                order={order}
                direction={direction}
              />
            </div>)
        })
      }

    </div>
  )
}

export default Conversation