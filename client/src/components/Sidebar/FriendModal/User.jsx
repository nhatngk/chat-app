import useSocket from '~/hooks/useSocket';
import Avatar from '~/components/Avatar';
import Button from './Button';

const User = ({ id, email, username, requestId, avatar, type }) => {
  const { socketEmit, userId } = useSocket();
  const handleUnfriend = async () => {
    console.log(userId, id);
   socketEmit("unfriend", userId, id);
  }

  const handleDelete = async () => {
    socketEmit("deleteRequest", userId, requestId);
  }

  const handleAccept = async () => {
    console.log(requestId);
    socketEmit("acceptRequest", requestId);
  }

  const handleAddFriend = async () => {
   socketEmit("addRequest", userId, id);
  }

  const render = () => {
    if (type === 'friend') {
      return (
        <Button handleOnclick={handleUnfriend} name='Unfriend'></Button>
      )
    } else if (type === 'sent') {
      return (
        <Button handleOnclick={handleDelete} name='Cancel'></Button>
      )
    } else if (type === 'received') {
      return (
        <div className='flex gap-2'>
          <Button handleOnclick={handleAccept} name='Accept'></Button>

          <Button handleOnclick={handleDelete} name='Reject'></Button>
        </div>
      )
    } else {
      return (
        <Button handleOnclick={handleAddFriend} name='Add Friend'></Button>
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