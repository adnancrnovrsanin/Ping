import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../../models/UserModels";
import { clearChatsData, clearUserChatsData } from "../../stores/chatsSlice";
import { logout } from "../../stores/authSlice";

export const userLogout = (userData: User | null) => {
    return async (dispatch: any) => {
        // try {
        //     await removePushToken(userData);
        // } catch (error) {
        //     console.log(error);
        // }

        await AsyncStorage.clear();
        dispatch(clearChatsData());
        dispatch(clearUserChatsData())
        dispatch(logout());
    }
}