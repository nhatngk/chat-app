import { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getAllMessages } from "~/api/chatApi";
import { chatActions } from "~/store/chatSlice";
import Avatar from "../Avatar";
import Message from "./Message"
import Loading from "../Loading";
import ArrowDown from "~/assets/svg/ArrowDown";


const Conversation = ({ typingList }) => {
  const dispatch = useDispatch();
  const endOfConversation = useRef(null);
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [atTheEnd, setAtTheEnd] = useState(false);
  const [height, setHeight] = useState(0);
  const containerRef = useRef(null);
  const userId = useSelector((state) => state.user.currentUser?.id);
  const currentChatRoom = useSelector((state) => state.chat.currentChatRoom);
  const conversation = useSelector((state) => state.chat.conversations).find(conversation => conversation.chatRoomId === currentChatRoom);
  
  useEffect(() => {
    setMessages(conversation?.messages)
  }, [conversation])

  useEffect(() => {
      setHeight(prev => {
        if (containerRef.current?.scrollHeight > prev) {
          return containerRef.current?.scrollHeight;
        }
        return prev
      });
  });

  useEffect(() => {
    scrollToTheEnd();
  }, [messages, height]);

  useEffect(() => {
    if (!!typingList.length && atTheEnd) {
      scrollToTheEnd();
      return;
    } else if (!typingList.length || !atTheEnd) {
      scrollToTheEnd();
      return;
    }
  }, [typingList])


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

  const handleOnScroll = (e) => {
    setAtTheEnd(e.target.scrollTop === e.target.scrollHeight - e.target.clientHeight);
  }

  const scrollToTheEnd = () => {
    endOfConversation.current?.scrollIntoView({ behavior: 'smooth' })
  }

  if (loading) return (
    <div className="flex-1 relative">
      <Loading />
    </div>
  )

  return (
    <div ref={containerRef} onScroll={handleOnScroll} className='relative flex-1 w-full flex flex-col py-2 px-4 gap-0.5 overflow-auto'>
      {
        !!messages.length && messages.map((message, index) => {
          let order = null;
          const senderId = message.sender._id;
          const direction = senderId === userId ? 'send' : 'receive';
          const isFirst = index === 0 || messages[index - 1].sender._id !== senderId;
          const isLast = index === messages.length - 1 || messages[index + 1].sender._id !== senderId;

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

      {
        !!typingList.length && (
          <div className="flex flex-col gap-1 mt-1">
            <div className="flex items-center gap-2">
              <Avatar srcImg={typingList[0]?.avatar} size="7" />
              <div className="typing-indicator bg-[#f5f5f5] px-4 py-3 receive order-single">
                <div className="dot"></div>
                <div className="dot"></div>
                <div className="dot"></div>
              </div>
            </div>

            <div className="ml-9">
              <p className="text-[#000] text-xs">
                {
                  typingList?.length === 1 ? `${typingList[0]?.username} is typing` : `${typingList[0]?.username} and others are typing`
                }
              </p>
            </div>
          </div>
        )
      }

      {
        !atTheEnd && (
          <button
            onClick={scrollToTheEnd}
            className="sticky p-5 bottom-10 flex-center left-1/2 translate-x-[-50%] z-80 size-10 rounded-full bg-[#f5f5f5]"
          >
            <ArrowDown />
          </button>
        )
      }
      <div ref={endOfConversation} />
    </div>
  )
}

export default Conversation