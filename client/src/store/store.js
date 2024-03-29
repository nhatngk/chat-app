import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./auth/authSlice";

const store = configureStore({
    auth: authSlice
})

export default store;


