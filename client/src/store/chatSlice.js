import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        currentChatRoom: {},
        messages: [],
    },
    reducers: {
        setCurrentChatRoom: (state, action) => {
            state.currentChatRoom = action.payload;
        },
        setMessages: (state, action) => {
            state.messages = action.payload;
        },
    },

});

export const { setCurrentChatRoom, setMessages } = chatSlice.actions;

export default chatSlice.reducer;

