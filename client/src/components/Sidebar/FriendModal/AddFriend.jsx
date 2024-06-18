import * as yup from "yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useSelector } from "react-redux";
import { setUser } from "~/store/userSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";


import User from "./User";
import { search } from "~/api/friendApi";

const schema = yup.object().shape({
  keyword: yup.string()
});

const AddFriend = () => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const { friends, sentRequests, receivedRequests } = useSelector((state) => state.friend);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
 
  const { register, handleSubmit } = useForm({
    mode: "onBlur",
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    try {
      const response = await search(data.keyword);
      if (response.users.length === 0) {
        setError("No user found!");
      } else {
        setError("");
        setUsers(response.users)
      }
    } catch (error) {
      if(error?.statusCode === 401) {
        dispatch(setUser(null));
        navigate("/sign-in", { replace: true }, { state: { from: location } });
      }
      setError(error.message);
    }
  }

  return (
    <div className="w-full h-full flex flex-col">
      <form type="submit" onSubmit={handleSubmit(onSubmit)}
        className="m-3 py-2 px-3 rounded-3xl bg-white border border-blur">
        <i className="fa-solid fa-magnifying-glass mr-2"></i>
        <input {...register("keyword")} id="keyword" type="text" placeholder="Search..." className="outline-none" />
      </form>
      <div className="px-3 overflow-y-auto flex-1">
        {
          error ? (
            <div className="text-center text-red">{error}</div>
          ) : (
            users.map((user) => {
              let type = null;
              let requestId = null;
              if (sentRequests.some(request => request.recipient._id === user._id)) {
                requestId = sentRequests.find(request => request.recipient._id === user._id)._id;
                type = 'sent';
              } else if (receivedRequests.some(request => request.sender._id  === user._id)) {
                requestId = receivedRequests.find(request => request.sender._id  === user._id)._id;
                type = 'received';
              } else if (friends.some(friend => friend.details._id === user._id)) {
                type = 'friend';
              } else {
                type = 'none';
              }
              return (
                <User
                  key={user._id}
                  id={user._id}
                  avatar={user.avatar}
                  email = {user.email}
                  requestId={requestId}
                  username={user.username}
                  type={type}
                />
              )
            })
          )
        }
      </div>
    </div>
  )
}

export default AddFriend