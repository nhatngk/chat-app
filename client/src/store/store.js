import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import friendSlice from "./friendSlice";

const store = configureStore({
    reducer: {
        user: userSlice,
        friend: friendSlice
    }
})

export default store;


