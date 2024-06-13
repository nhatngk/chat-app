import { useState, useRef, useEffect } from 'react'
import { useDispatch } from 'react-redux';
import useSocket from '~/hooks/useSocket';
import useFriends from '~/hooks/useFriends';
import { friendActions } from '~/store/friendSlice';
import { chatActions } from '~/store/chatSlice';
import Friends from './Friends';
import AddFriend from './AddFriend';
import ReceivedRequest from './ReceivedRequest';
import SentRequest from './SentRequest';
import CloseButton from '~/assets/svg/CloseButton';

const FriendModal = (props) => {
  const { setShowFriendModal } = props;
  const { socketListen, userId, socket } = useSocket();
  const { loading, error } = useFriends();
  const dispatch = useDispatch();

  const modal = useRef(null);
  const sectionList = [
    {
      name: 'Friends',
      content: <Friends />
    },
    {
      name: 'Add Friend',
      content: <AddFriend />
    },
    {
      name: 'Received Requests',
      content: <ReceivedRequest />
    },
    {
      name: 'Sent Requests',
      content: <SentRequest />
    }
  ];

  const [activeSection, setActiveSection] = useState(sectionList[0]);

  const handleOnClick = (e) => {
    if (e.target === modal.current) {
      setShowFriendModal(false);
    }
  }

  useEffect(() => {
    socketListen("sentRequest", (newRequest) => {
      dispatch(friendActions.addSentRequest(newRequest));
    })

    socketListen("receivedRequest", (newRequest) => {
      dispatch(friendActions.addReceivedRequest(newRequest));
    })

    socketListen("deleteSent", (requestId) => {
      dispatch(friendActions.removeSentRequest(requestId));
    })

    socketListen("deleteReceived", (requestId) => {
      dispatch(friendActions.removeReceivedRequest(requestId));
    })

    socketListen("acceptSent", (chatRoom, requestId) => {
      const newFriend = chatRoom.members.find(member => member._id.toString() !== userId.toString());
      dispatch(friendActions.addFriend({
        details: newFriend,
        chatRoomId: chatRoom._id
      }));
      dispatch(chatActions.addChatRoom(chatRoom));
      dispatch(friendActions.removeSentRequest(requestId));
    })

    socketListen("acceptReceived", (chatRoom, requestId) => {
      const newFriend = chatRoom.members.find(member => member._id.toString() !== userId.toString());
      dispatch(friendActions.addFriend({
        details: newFriend,
        chatRoomId: chatRoom._id
      }));
      dispatch(chatActions.addChatRoom(chatRoom));
      dispatch(friendActions.removeReceivedRequest(requestId));
    })

    socketListen("unfriend", (friendId) => {
      dispatch(friendActions.removeFriend(friendId));
    })

    return () => {
      socket.off("sentRequest");
      socket.off("receivedRequest");
      socket.off("deleteSent");
      socket.off("deleteReceived");
      socket.off("acceptSent");
      socket.off("acceptReceived");
      socket.off("unfriend");
    }
  }, []);

  return (
    <div onClick={handleOnClick}>
      <div className="flex justify-center items-center fixed inset-0 z-50" ref={modal}>
        <div className='flex flex-col relative p-2 pb-0 w-1/2 h-3/4 min-w-[450px] bg-white rounded-3xl'>
          <h1 className="text-center">Friends</h1>

          <div className='flex h-full border-t-[1px] border-blur' >
            <div className='flex flex-col p-2 gap-2 border-r border-blur'>
              {
                sectionList.map((section, index) => (
                  <button
                    key={index}
                    className={`px-4 py-2 w-full text-start font-semibold border-l hover:text-blue ${activeSection.name === section.name ? 'text-blue border-l-blue hover:border-l-blue' : 'border-l-slate hover:border-l-disable'} `}
                    onClick={() => setActiveSection(section)}>
                    {section.name}
                  </button>
                ))
              }
            </div>

            <div className='w-full relative'>
              {activeSection.content}
            </div>

          </div>

          <button
            onClick={() => setShowFriendModal(false)}
            className='absolute p-2 top-2 right-2 rounded-full hover:bg-blur'>
            <CloseButton onClick={() => setShowFriendModal(false)} />
          </button>
        </div>
      </div>

      <div className="opacity-30 bg-blur fixed inset-0 z-40 "></div>
    </div>
  )
}

export default FriendModal