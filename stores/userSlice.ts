import { createSlice } from "@reduxjs/toolkit";
import { User } from "../models/UserModels";

interface StoredUsers {
    [key: string]: User;
}

interface UserState {
    storedUsers: StoredUsers;
}

const initialState: UserState = {
    storedUsers: {}
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setStoredUsers: (state, action) => {
            const { newUsers } = action.payload;
            
            let existingUsers = state.storedUsers;
            const usersArray = Object.values(newUsers);

            for (let i = 0; i < usersArray.length; i++) {
                const userData = usersArray[i];
                // @ts-ignore
                existingUsers = { ...existingUsers, [userData.phoneNumber]: userData };
            }

            state.storedUsers = existingUsers;
        }
    }
});

export const { setStoredUsers } = userSlice.actions;
export default userSlice.reducer;