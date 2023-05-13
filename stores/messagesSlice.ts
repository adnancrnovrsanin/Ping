import { createSlice } from "@reduxjs/toolkit";

const messagesSlice = createSlice({
    name: 'messages',
    initialState: {
        messagesData: {},
        starredMessages: {}
    },
    reducers: {
        setChatMessages: (state, action) => {
            const { chatId, messagesData } = action.payload;
            
            //@ts-ignore
            state.messagesData[chatId] = messagesData;

            state.messagesData = { ...state.messagesData };
        },
        addStarredMessage: (state, action) => {
            const { starredMessageData } = action.payload;

            //@ts-ignore
            state.starredMessages[starredMessageData.messageId] = starredMessageData;
        },
        removeStarredMessage: (state, action) => {
            const { messageId } = action.payload;
            //@ts-ignore
            delete state.starredMessages[messageId];
        },
        setStarredMessages: (state, action) => {
            const { starredMessages } = action.payload;
            state.starredMessages = { ...starredMessages };
        }
    }
});

export const { setChatMessages, addStarredMessage, removeStarredMessage, setStarredMessages } = messagesSlice.actions;
export default messagesSlice.reducer;