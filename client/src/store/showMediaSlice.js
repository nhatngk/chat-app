import { createSlice } from "@reduxjs/toolkit";

const showMediaSlice = createSlice({
    name: "showMedia",
    initialState: {
        isShow: false,
        type: null,
        url: null,
    },
    reducers: {
        setShowMedia: (state, action) => {
            state.isShow = action.payload.isShow;
            state.type = action.payload.type;
            state.url = action.payload.url;
        },
    },

});

export const { setShowMedia } = showMediaSlice.actions;

export default showMediaSlice.reducer;

