import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import friendSlice from "./friendSlice";
import chatSlice from "./chatSlice";
import showMediaSlice from "./showMediaSlice";

const store = configureStore({
    reducer: {
        chat: chatSlice,
        friend: friendSlice,
        user: userSlice,
        showMedia: showMediaSlice
    }
})

export default store;


