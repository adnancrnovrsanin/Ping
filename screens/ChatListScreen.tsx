import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import PageContainer from "../components/PageContainer";
import { useEffect, useRef } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import CustomMenuItem from "../components/CustomMenuItem";
import { Entypo } from "@expo/vector-icons";

const ChatListScreen = (props: any) => {

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
    }, []);

    return (
        <PageContainer style={styles.container}>
            <Text>Chat List Screen</Text>
            <TouchableNativeFeedback onPress={() => props.navigation.navigate("ChatScreen")}>
                <Text>Chat Screen</Text>
            </TouchableNativeFeedback>
        </PageContainer>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: "center",
        textAlign: "center",
    }
})

export default ChatListScreen;