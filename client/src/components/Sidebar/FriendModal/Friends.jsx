import { useSelector } from 'react-redux';
import User from './User';

const Friends = () => {
  const friends = useSelector(state => state.friend.friends);
  return (
    <div>
      {friends.length === 0
        ? (
          <p className="text-center">No friends</p>
        ) : (
          friends.map((friend) => (
            <User
              key={friend.details._id}
              id={friend.details._id}
              avatar={friend.details.avatar}
              username={friend.details.username}
              email={friend.details.email}
              type="friend"
            />
      )))
      }
    </div>
  )
}

export default Friends