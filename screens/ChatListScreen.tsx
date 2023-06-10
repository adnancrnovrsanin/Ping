import { StyleSheet, Text, TouchableNativeFeedback, View, FlatList, Dimensions } from "react-native";
import PageContainer from "../components/PageContainer";
import { useEffect, useRef } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import CustomMenuItem from "../components/CustomMenuItem";
import { Entypo } from "@expo/vector-icons";
import { RootState } from "../stores/store";
import { useSelector } from "react-redux";
import DataItem from "../components/DataItem";

const ChatListScreen = (props: any) => {
    const userData = useSelector((state: RootState) => state.auth.userData);
    // const userChats = useSelector((state: RootState) => {
    //     const chatsData = state.chats.userChatsData;
    //     // @ts-ignore
    //     return Object.values(chatsData).sort((a, b) => new Date(b.chat.updatedAt) - new Date(a.chat.updatedAt));
    // });
    const userChats = useSelector((state: RootState) => Object.values(state.chats.userChatsData));
    const storedUsers = useSelector((state: RootState) => state.users.storedUsers);

    const menuRef = useRef(null);

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
                    <>
                        <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                            <Item 
                                title="Search Chats"
                                iconName="search"
                                color="white"
                                onPress={() => {}}
                            />
                            <Item 
                                title="Options"
                                iconName="ellipsis-vertical"
                                color="white"
                                onPress={() => {
                                    if (menuRef?.current)
                                    // @ts-ignore
                                        menuRef.current.props.ctx.menuActions.openMenu("ChatListMenu");
                                }}
                            />
                        </HeaderButtons>

                        <Menu name="ChatListMenu" ref={menuRef}>
                            <MenuTrigger />

                            <MenuOptions>
                                <CustomMenuItem text="New group chat" iconPack={Entypo} icon="chat" onSelect={() => props.navigation.navigate("NewChat")} />
                                <CustomMenuItem text="Settings" icon="settings" />
                            </MenuOptions>
                        </Menu>
                    </>
                );
            }
        });
    }, [userChats]);

    return (
        <PageContainer style={styles.container}>
            {
                userChats.length > 0 && (
                    <FlatList
                        data={userChats}
                        keyExtractor={(item, index) => index.toString()}
                        style={{
                            flex: 1,
                            // backgroundColor: "red"
                        }}
                        renderItem={(itemData) => {
                            const item = itemData.item;
                            const chatData = item.chat;
                            const chatId = chatData.id;
                            const isGroupChat = chatData.chatType === "GROUPCHAT";
                            
                            let title = "";
                            let image = "";
                            

                            if (isGroupChat) {
                                title = chatData.chatName || "";
                                image = chatData.chatImageUrl || "";
                            } else {
                                const otherUserPhoneNumber = chatData.memberPhoneNumbers.find((phoneNumber: string) => phoneNumber !== userData?.phoneNumber);
                                const otherUser = storedUsers[otherUserPhoneNumber!];

                                if (!otherUser) return null;

                                title = otherUser.phoneNumber;
                                image = otherUser.profilePictureUrl || "";
                            }

                            return (
                                <DataItem 
                                    title={title}
                                    // subTitle={chatData.latestMessageText || "New chat"}
                                    subTitle={"New chat"}
                                    image={image}
                                />
                            );
                        }}
                    />
                )
            }
            {
                userChats.length === 0 && (
                    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
                        <Text>You have no chats</Text>
                    </View>
                )
            }
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default ChatListScreen;