import { createSlice } from "@reduxjs/toolkit";

const friendSlice = createSlice({
    name: "friend",
    initialState: {
        friends: [],
        sentRequests: [],
        receivedRequests: [],
    },
    reducers: {
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
        addFriend: (state, action) => {
            state.friends.push(action.payload);
        },
        removeFriend: (state, action) => {
            state.friends = state.friends.filter(friend => friend.details._id.toString() !== action.payload.toString());
        },
        setReceivedRequests: (state, action) => {
            state.receivedRequests = action.payload;
        },
        addReceivedRequest: (state, action) => {
            state.receivedRequests.push(action.payload);
        },
        removeReceivedRequest: (state, action) => {
            state.receivedRequests = state.receivedRequests.filter((request) => request._id.toString() !== action.payload);
        },
        setSentRequests: (state, action) => {
            state.sentRequests = action.payload;
        },
        addSentRequest: (state, action) => {
            state.sentRequests.push(action.payload);
        },
        removeSentRequest: (state, action) => {
            state.sentRequests = state.sentRequests.filter((request) => request._id.toString() !== action.payload.toString() );
    },
    }       
});

export const friendActions = friendSlice.actions;

export default friendSlice.reducer;

