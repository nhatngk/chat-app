import {useState} from 'react';
import { useDispatch } from 'react-redux';
import Avatar from '~/components/Avatar';
import Button from './Button';
import { addFriend, cancelRequest, acceptRequest, rejectRequest, unfriend } from '~/api/friendApi';
import { setFriends, setReceivedRequests, setSentRequests } from '~/store/friendSlice';
import { notifySuccess, notifyError } from '~/utils/toastify';

const User = ({ id, email, username, requestId, avatar, type }) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const handleUnfriend = async () => {
    if (isLoading) return;
    setIsLoading(true);
    try {
      const response = await unfriend(id);
      dispatch(setFriends(response));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleCancel = async () => {
    console.log(1);
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await cancelRequest(requestId);
      dispatch(setSentRequests(response));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAccept = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await acceptRequest(requestId);
      dispatch(setReceivedRequests(response));
      dispatch(setFriends(response));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleReject = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await rejectRequest(requestId);
      dispatch(setReceivedRequests(response));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const handleAddFriend = async () => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const response = await addFriend(id);
      dispatch(setSentRequests(response));
    } catch (error) {
      notifyError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  const render = () => {
    if (type === 'friend') {
      return (
        <Button handleOnclick={handleUnfriend} isLoading={isLoading} name='Unfriend'></Button>
      )
    } else if (type === 'sent') {
      return (
        <Button handleOnclick={handleCancel} isLoading={isLoading} name='Cancel'></Button>
      )
    } else if (type === 'received') {
      return (
        <div className='flex gap-2'>
          <Button handleOnclick={handleAccept} isLoading={isLoading} name='Accept'></Button>

          <Button handleOnclick={handleReject} isLoading={isLoading} name='Reject'></Button>
        </div>
      )
    } else {
      return (
        <Button handleOnclick={handleAddFriend} isLoading={isLoading} name='Add Friend'></Button>
      )
    }
  }
  return (
    <div key={id} className='flex justify-between p-2'>
      <div className='flex items-center gap-2'>
        <Avatar srcImg={avatar} size={10} />
        <div>
          <p>{username}</p>
          <p>{email}</p>
        </div>
      </div>

      {render()}
    </div>
  )
}

export default User