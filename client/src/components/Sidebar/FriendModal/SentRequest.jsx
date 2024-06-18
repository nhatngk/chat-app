import { useSelector } from "react-redux";
import User from "./User";
const SentRequest = () => {
  const { sentRequests } = useSelector((state) => state.friend);

  return (
    <div className="p-3 flex flex-col overflow-y-auto">
      {sentRequests.map((request) => (
        <User
          key={request.recipient._id}
          id={request.recipient._id}
          avatar={request.recipient.avatar}
          email={request.recipient.email}
          username={request.recipient.username}
          requestId={request._id}
          type="sent"
        />
      ))}
    </div>
  )
}

export default SentRequest