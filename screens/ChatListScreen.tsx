import { StyleSheet, Text, TouchableNativeFeedback, View } from "react-native";
import PageContainer from "../components/PageContainer";
import { useEffect } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";

const ChatListScreen = (props: any) => {

    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => {
                return (
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
                            onPress={() => {}}
                        />
                    </HeaderButtons>
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