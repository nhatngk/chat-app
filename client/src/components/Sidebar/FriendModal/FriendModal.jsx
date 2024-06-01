import { useEffect, useState, useRef } from 'react'

import { friendsAndRequests } from '~/api/friendApi';
import { useDispatch } from 'react-redux';
import { setFriends, setReceivedRequests, setSentRequests } from '~/store/friendSlice';
import Loading from '~/components/Loading';
import Friends from './Friends';
import AddFriend from './AddFriend';
import ReceivedRequest from './ReceivedRequest';
import SentRequest from './SentRequest';
import CloseButton from '~/assets/svg/CloseButton';

const FriendModal = (props) => {
  const { setShowFriendModal } = props;
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
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
    let isMounted = true;
    const getFriendRequests = async () => {
      try {
        const response = await friendsAndRequests();
        dispatch(setFriends(response));
        dispatch(setSentRequests(response));
        dispatch(setReceivedRequests(response));
      } catch (error) {
        setError(true);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }
    getFriendRequests();

    return () => { isMounted = false }
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
              {isLoading ? <Loading /> : (
                error ? (
                  <div>
                    <p className="text-center my-2 text-red">An error occurred. Please try again!</p>
                  </div>) : activeSection.content)}
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