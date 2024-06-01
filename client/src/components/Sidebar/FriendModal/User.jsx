import { useDispatch } from 'react-redux';
import Avatar from '~/components/Avatar';
import { addFriend, cancelRequest, acceptRequest, rejectRequest, unfriend } from '~/api/friendApi';
import { setFriends, setReceivedRequests, setSentRequests } from '~/store/friendSlice';
import { notifySuccess, notifyError } from '~/utils/toastify';
const User = ({ id, email, username, requestId, avatar, type }) => {
  const dispatch = useDispatch();
  const handleUnfriend = async() => {
    try {
      const response = await unfriend(id);
      console.log(response);
      dispatch(setFriends(response));
    } catch (error) {
      notifyError(error.message);
    }
  }

  const handleCancel = async() => {
    try {
      const response = await cancelRequest(requestId);
      dispatch(setSentRequests(response));
    } catch (error) {
      notifyError(error.message);
    }
  }

  const handleAccept = async() => {
    try {
      const response = await acceptRequest(requestId);
      console.log(response);
      dispatch(setReceivedRequests(response));
      dispatch(setFriends(response));
    } catch (error) {
      notifyError(error.message);
    }
  }

  const handleReject = async() => {
    try {
      const response = await rejectRequest(requestId);
      dispatch(setReceivedRequests(response));
    } catch (error) {
      notifyError(error.message);
    }
  }

  const handleAddFriend = async () => {
    try {
      const response = await addFriend(id);
      dispatch(setSentRequests(response));
    } catch (error) {
      notifyError(error.message);
    }
  }

  const render = () => {
    if (type === 'friend') {
      return (
        <button className='text-white bg-blue p-2 rounded-xl hover:bg-ocean' onClick={handleUnfriend}>
          Unfriend
        </button>
      )
    } else if (type === 'sent') {
      return (
        <button className='text-white bg-blue p-2 rounded-xl hover:bg-ocean' onClick={handleCancel}>
          Cancel
        </button>
      )
    } else if (type === 'received') {
      return (
        <div className='flex gap-2'>
          <button className='text-white bg-blue p-2 rounded-xl hover:bg-ocean' onClick={handleAccept}>
            Accept
          </button>

          <button className='text-white bg-blue p-2 rounded-xl hover:bg-ocean' onClick={handleReject}>
            Reject
          </button>
        </div>
      )
    } else {
      return (
        <button className='text-white bg-blue p-2 rounded-xl hover:bg-ocean' onClick={handleAddFriend}>
          Add friend
        </button>
      )
    }
  }
  return (
    <div key={id} className='flex justify-between p-2'>
      <div className='flex items-center gap-2'>
        <Avatar srcImg={avatar} size={10  } />
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