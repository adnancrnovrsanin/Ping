import agent from "../../api/agent";

export const getUserDataByPhoneNumber = async (phoneNumber: string) => {
    try {
        const userData = await agent.Account.getUserByPhoneNumber(phoneNumber);
        return userData;
    } catch (error) {
        console.log(error);
    }
}