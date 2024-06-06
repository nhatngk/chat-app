import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import friendSlice from "./friendSlice";
import chatSlice from "./chatSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        friend: friendSlice,
        chat: chatSlice
    }
})

export default store;


