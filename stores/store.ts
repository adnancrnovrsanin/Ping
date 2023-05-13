import { configureStore } from '@reduxjs/toolkit';
import authSlice from './authSlice';
import chatsSlice from './chatsSlice';
import messagesSlice from './messagesSlice';
import userSlice from './userSlice';

export const store = configureStore({
    reducer: {
        auth: authSlice,
        chats: chatsSlice,
        messages: messagesSlice,
        user: userSlice
    }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
