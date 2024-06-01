import { useSelector } from "react-redux";
import User from "./User";
const ReceivedRequest = () => {
  const { receivedRequests } = useSelector((state) => state.friend);

  return (
    <div className="p-3 flex flex-col overflow-y-auto">
      {receivedRequests.map((request) => (
        <User
          id={request.sender._id}
          avatar={request.sender.avatar}
          username={request.sender.username}
          requestId={request._id}
          type="received"
        />
      ))}
    </div>
  )
}

export default ReceivedRequest