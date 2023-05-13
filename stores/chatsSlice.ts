import { createSlice } from "@reduxjs/toolkit";

const chatSlice = createSlice({
    name: 'chats',
    initialState: {
        chatsData: {},
    },
    reducers: {
        setChatsData: (state, action) => {
            state.chatsData = { ...action.payload.chatsData }
        },
        clearChatsData: (state, action) => {
            state.chatsData = {}
        }
    }
});

export const { setChatsData, clearChatsData } = chatSlice.actions;
export default chatSlice.reducer;