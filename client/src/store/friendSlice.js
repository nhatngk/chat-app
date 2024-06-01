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
            state.friends = action.payload.friends;
        },

        setReceivedRequests: (state, action) => {
            state.receivedRequests = action.payload.receivedRequests;
        },

        setSentRequests: (state, action) => {
            state.sentRequests = action.payload.sentRequests;
        },
    },

});

export const { setFriends, setReceivedRequests, setSentRequests } = friendSlice.actions;

export default friendSlice.reducer;

