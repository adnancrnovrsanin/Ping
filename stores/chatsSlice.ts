import { createSlice } from "@reduxjs/toolkit";
import { Chat, UserChat } from "../models/Chat";

interface ChatsData {
    [key: string]: Chat;
}
interface UserChatsData {
    [key: string]: UserChat;
}
interface ChatsState {
    userChatsData: UserChatsData;
    chatsData: ChatsData;
}

const initialState: ChatsState = {
    userChatsData: {},
    chatsData: {}
}

const chatSlice = createSlice({
    name: 'chats',
    initialState,
    reducers: {
        setUserChatsData: (state, action) => {
            state.userChatsData = { ...action.payload.userChatsData };
        },
        clearChatsData: (state, action) => {
            state.chatsData = {}
        }
    }
});

export const { setUserChatsData, clearChatsData } = chatSlice.actions;
export default chatSlice.reducer;