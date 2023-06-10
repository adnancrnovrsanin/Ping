import agent from "../../api/agent";

export const getUserData = async (phoneNumber: string) => {
    try {
        const currUser = await agent.Account.getUser();
    } catch (error) {
        console.log(error);
    }
}