import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: "chat",
    initialState: {
        chatRooms: [],
        currentChatRoom: null,
        conversations: [],
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
        },
        setOnlineUser: (state, action) => {
            state.chatRooms.forEach((chatRoom) => {
                const index = chatRoom.members.findIndex((member) => member._id === action.payload);
                if (index !== -1) chatRoom.members[index].status = {
                    online: true,
                    lastSeen: null
                };
            })
        },
        setOfflineUser: (state, action) => {
            state.chatRooms.forEach((chatRoom) => {
                const index = chatRoom.members.findIndex((member) => member._id === action.payload.userId);
                if (index !== -1) chatRoom.members[index].status = {
                    online: false,
                    lastSeen: action.payload.time
                };
            })
        },
        addConversation: (state, action) => {
            state.conversations.push(action.payload);
        },
        addMessage: (state, action) => {
            const { chatRoomId, message } = action.payload;
            const index = state.conversations.findIndex((conversation) => conversation.chatRoomId === chatRoomId);
            if (index !== -1) state.conversations[index].messages.push(message);

            const chatRoom = state.chatRooms.findIndex((chatRoom) => chatRoom._id === chatRoomId);
            if (chatRoom !== -1) state.chatRooms[chatRoom].latestMessage = message;
            state.chatRooms.sort((a, b) => {
                if (!a.latestMessage && !b.latestMessage) {
                    return new Date(b.createdAt) - new Date(a.createdAt);
                }
                if (!a.latestMessage) return 1;
                if (!b.latestMessage) return -1;
                return new Date(b.latestMessage.timeSent) - new Date(a.latestMessage.timeSent);
            });
        },
        signOut: (state) => {
            state.chatRooms = [];
            state.currentChatRoom = null;
            state.conversations = [];
        }
    },

});

export const chatActions = chatSlice.actions;

export default chatSlice.reducer;

