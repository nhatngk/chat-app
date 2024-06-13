import { createSlice, current } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chatRooms: [],
        currentChatRoom: null,
    },
    reducers: {
        setChatRooms: (state, action) => {
            state.chatRooms = action.payload;
        },
        addChatRoom: (state, action) => {
            state.chatRooms.push(action.payload);
        },
        setCurrentChatRoom: (state, action) => {
            state.currentChatRoom = action.payload;
        }
    },

});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;

