import agent from "../../api/agent";
import { setUserChatsData } from "../../stores/chatsSlice";
import { store } from "../../stores/store";
import { setStoredUsers } from "../../stores/userSlice";
import { getUserDataByPhoneNumber } from "./userActions";

export const getUserChats = async (userPhoneNumber: string) => {
    const storedUsers = store.getState()?.users?.storedUsers;
    try {
        const result = await agent.UserChatRequests.getUserChatsRequest(userPhoneNumber);
        var chatsData = {};
        var userData = {};

        for (let i = 0; i < result.length; i++) {
            var userChats = result[i];
            chatsData = { ...chatsData, [userChats.chat.id.toString()]: userChats.chat };
            
            for (let j = 0; j < userChats.chat.memberPhoneNumbers.length; j++) {
                const member = userChats.chat.memberPhoneNumbers[j];
                if (member !== userPhoneNumber && !storedUsers[member]) {
                    var user = await getUserDataByPhoneNumber(member);
                    if (user) userData = { ...userData, [user.phoneNumber]: user };
                }
            }
        }
        
        store.dispatch(setStoredUsers({ newUsers: userData }));
        store.dispatch(setUserChatsData({ userChatsData: result }));
        
        return chatsData ?? {};
    } catch (error) {
        console.log(error);
    }
}