import { ActivityIndicator, FlatList, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableNativeFeedback, TouchableOpacity, View } from "react-native";
import PageContainer from "../components/PageContainer";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { HeaderButton, HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { isLoading } from "expo-font";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../constants/colors";
import Bubble from "../components/Bubble";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { CreateMessageRequest, Message, MessageDto, MessageType } from "../models/Message";
import agent from "../api/agent";
import { sendMessage } from "../utils/actions/messageActions";
import ProfileImage from "../components/ProfileImage";
import { API_IP_PORT } from "../constants/hosts";
import SockJS from "sockjs-client";
import { Client, Frame } from "stompjs";
import stompjs from "stompjs";
import { updateChatsData, updateUserChatsData } from "../stores/chatsSlice";
import { CreateChatRequest } from "../models/Chat";
import CustomMenuItem from "../components/CustomMenuItem";
import { Menu, MenuOptions, MenuTrigger } from "react-native-popup-menu";

var stompClient: Client | null = null;

const ChatScreen = (props: any) => {
    const dispatch = useDispatch();
    const [messageText, setMessageText] = useState("");
    const [chatId, setChatId] = useState(props.route?.params?.chatId);
    const [errorBannerText, setErrorBannerText] = useState("");
    const [replyingTo, setReplyingTo] = useState("");
    const [chatMessages, setChatMessages] = useState<Message[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const flatList = useRef<FlatList<any>>(null);
    const menuRef = useRef<any>(null);

    const storedChats = useSelector((state: RootState) => state.chats.chatsData);
    const userData = useSelector((state: RootState) => state.auth.userData);
    const storedUsers = useSelector((state: RootState) => state.users.storedUsers);
    const storedUserChats = useSelector((state: RootState) => state.chats.userChatsData);
    const storedContacts = useSelector((state: RootState) => state.contacts.storedContacts);
    const newChatData = props.route?.params?.newChatData;
    const [chatData, setChatData] = useState((chatId && storedChats[chatId]) || (props.route?.params?.newChatData as CreateChatRequest));
    const [isGroupChat, setIsGroupChat] = useState(props.route?.params?.isGroupChat ?? false);

    console.log("chatId chat screen: " + chatId);

    useEffect(() => {
        if (chatId) {
            var socket = new SockJS(`http://192.168.1.27:8080/ws`);
            stompClient = stompjs.over(socket); 
            stompClient.debug = (str: string) => {
                console.log(new Date(), str);
            };
            stompClient.connect({}, onConnected, onErrorHandler);
        };
    }, [chatId]);

    function onConnected(frame?: Frame | undefined) {
        console.log("Connected: " + frame);
        stompClient?.subscribe(`/user/${chatId}/message`, onMessageReceived);
    }
    
    function onErrorHandler(error: string | Frame) {
        console.log("Error: " + error);
    }

    function onMessageReceived(message: stompjs.Message) {
        const payloadData = JSON.parse(message.body) as MessageDto;
        var newChatMessage = {
            ...payloadData,
            createdAt: new Date(payloadData.createdAt)
        };
        let userChat = Object.values(storedUserChats).find(i => i.chat.id === chatId);
        let chat = storedChats[chatId];
        console.log("onmessagedata: " + userChat + " " + chat);
        if (userChat) {
            userChat.chat.latestMessage = newChatMessage.message;
            userChat.chat.updatedAt = (new Date()).toISOString();
            chat.latestMessage = newChatMessage.message;
            chat.updatedAt = (new Date()).toISOString();
            dispatch(updateUserChatsData({ userChat: userChat }));
            dispatch(updateChatsData({ chat: chat }));
        }
        console.log("NewChatMessage: ", newChatMessage);
        setChatMessages(prev => [...prev, newChatMessage]);
    }

    useEffect(() => {
        (
            async () => {
                if (!chatId) return;

                try {
                    setIsLoading(true);

                    const chatMessagesArr = await agent.MessageRequests.getChatMessagesRequest(chatId);

                    if (!chatMessagesArr) return;

                    let chatMessagesArrCopy: Message[] = [];
                    for (let i = 0; i < chatMessagesArr.length; i++) {
                        const message = chatMessagesArr[i];
                        chatMessagesArrCopy.push({
                            ...message,
                            createdAt: new Date(message.createdAt)
                        });
                    }

                    setChatMessages(chatMessagesArrCopy.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime()));
                } catch (error) {
                    console.log(error);
                } finally {
                    setIsLoading(false);
                }
            }
        )();
    }, []);

    useEffect(() => {
        setChatId(props.route?.params?.chatId);
    }, [props.route?.params]);

    useEffect(() => {
        setChatData((chatId && storedChats[chatId]) || (props.route?.params?.newChatData as CreateChatRequest));
        setIsGroupChat(props.route?.params?.isGroupChat ?? false);
    }, [props.route?.params]);

    const getChatTitle = useCallback(() => {
        if (!chatData || !userData) return "";
        if (isGroupChat) return chatData.chatName ?? "";
        
        let otherUserPhoneNumber = chatData.memberPhoneNumbers.find((i: any) => i !== userData?.phoneNumber);
        if (!otherUserPhoneNumber) return "Chat";

        let otherUser = storedUsers[otherUserPhoneNumber];

        return storedContacts[otherUserPhoneNumber]?.displayName ?? otherUser?.displayName ?? otherUserPhoneNumber;
    }, [chatData, userData]);

    const getChatImageUrl = () => {
        if (!chatData || !userData) return "";
        if (isGroupChat) return chatData.chatImageUrl ?? null;
        
        let otherUserPhoneNumber = chatData.memberPhoneNumbers.find((i: any) => i !== userData?.phoneNumber);
        if (!otherUserPhoneNumber) return null;

        let otherUser = storedUsers[otherUserPhoneNumber];

        console.log("otherUser: ", otherUser);

        return otherUser?.profilePictureUrl ?? null;
    };

    useEffect(() => {
        if (!chatData || !userData) return;
        props.navigation.setOptions({
            headerTitle: getChatTitle(),
            headerLeft: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <TouchableOpacity
                            onPress={() => props.navigation.goBack()}
                            style={{ flexDirection: "row", alignItems: "center" }}
                        >
                            <>
                                <Item
                                    title="Back"
                                    iconName="arrow-back"
                                    color="white"
                                    style={{ marginLeft: -20 }}
                                    onPress={() => props.navigation.goBack()}
                                />
                                <ProfileImage 
                                    uri={getChatImageUrl()}
                                    style={{ marginRight: 10, marginLeft: -5 }}
                                    size={40}
                                    title={getChatTitle()}
                                />
                            </>
                        </TouchableOpacity>
                    </HeaderButtons>
                );
            },
            headerRight: () => {
                return (
                    <HeaderButtons HeaderButtonComponent={CustomHeaderButton}>
                        <Item 
                            title="Video Call"
                            iconName="videocam"
                            color="white"
                            onPress={() => {}}
                        />
                        <Item 
                            title="Audio Call"
                            iconName="call-outline"
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
                                    menuRef.current.props.ctx.menuActions.openMenu("ChatScreenMenu");
                            }}
                            style={{ marginRight: -20 }}
                        />

                        <Menu name="ChatScreenMenu" ref={menuRef}>
                            <MenuTrigger />
                            
                            <MenuOptions>
                                <CustomMenuItem 
                                    text={isGroupChat ? "Group Info" : "View Contact"}
                                    iconName="information-circle-outline"
                                    onSelect={() => {
                                        isGroupChat ? 
                                        props.navigation.navigate("ChatSettings", { chatId }) :
                                        props.navigation.navigate("Contact", { uid: chatData.memberPhoneNumbers.filter((number: any) => number !== userData?.phoneNumber) })
                                    }}
                                />

                            </MenuOptions>
                        </Menu>
                    </HeaderButtons>
                );
            },
        });
    }, []) ;

    const sendMessageHandler = useCallback(async () => {
        if (!userData) return;

        if (messageText.trim() === "") return;

        try {
            setIsLoading(true);

            const newMessage: CreateMessageRequest = {
                message: messageText,
                chatId: chatId,
                senderPhoneNumber: userData.phoneNumber,
                replyToMessageId: replyingTo ? replyingTo : null,
                messageType: MessageType.TEXT,
                mediaUrl: null
            };

            if (stompClient) {
                stompClient.send(`/app/chat`, {}, JSON.stringify(newMessage));
            }

            // sendMessage(newMessage);

            setMessageText("");
        } catch (error) {
            console.log(error);
            setErrorBannerText("Error sending message");
            setTimeout(() => setErrorBannerText(""), 3000);
        } finally {
            setIsLoading(false);
        }
    }, [messageText, chatId]);

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.screen} behavior={ Platform.OS === "ios" ? "padding" : undefined } keyboardVerticalOffset={100}>

                <PageContainer style={styles.backgroundImage}>

                        {
                            chatMessages.length === 0 && !isLoading && (
                                <Bubble text="This is a new chat. Say hi!" type="system" />
                            )
                        }

                        {
                            errorBannerText !== "" && (
                                <Bubble text={errorBannerText} type="error" />
                            )
                        }

                        {
                            chatId && chatMessages.length > 0 && (
                                <FlatList 
                                    style={{
                                        marginVertical: 10,
                                    }}
                                    data={chatMessages}
                                    // @ts-ignore
                                    ref={(ref) => flatList.current = ref}
                                    onContentSizeChange={() => chatMessages.length > 0 && flatList.current?.scrollToEnd({ animated: false })}
                                    onLayout={() => flatList.current?.scrollToEnd({ animated: false })}
                                    renderItem={itemData => {
                                        const message = itemData.item;
                                        console.log("message: " + JSON.stringify(message));

                                        const sender = message.senderPhoneNumber && storedUsers[message.senderPhoneNumber];
                                        const name = sender && sender.displayName;

                                        let messageType;
                                        switch (message.messageType) {
                                            case MessageType.TEXT:
                                                if (message.senderPhoneNumber === userData?.phoneNumber) messageType = "sent";
                                                else messageType = "received";
                                                break;
                                            case MessageType.IMAGE:
                                                break;
                                            case MessageType.VIDEO:
                                                break;
                                            case MessageType.AUDIO:
                                                break;
                                            case MessageType.DOCUMENT:
                                                break;
                                            case MessageType.INFO:
                                                messageType = "system";
                                                break;
                                        }

                                        return (
                                            <Bubble 
                                                text={message.message} 
                                                type={messageType} 
                                                messageId={message.id.toString()}
                                                userId={userData?.phoneNumber}
                                                chatId={chatId}
                                                date={message.createdAt}
                                                name={chatData.chatType != "GROUPCHAT" || message.senderPhoneNumber === userData?.phoneNumber ? undefined : name}
                                                setReply={() => setReplyingTo(message.id.toString())}
                                                replyingTo={message.replyToMessageId && chatMessages.find(i => i.id === message.replyToMessageId)}
                                                imageUrl={message?.mediaUrl}
                                            />
                                        );
                                    }}
                                />
                            )
                        }

                        {
                            isLoading && (
                                <ActivityIndicator size="large" color={colors.primary} />
                            )
                        }

                </PageContainer>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.textbox} placeholder="Write a message..." onChangeText={text => setMessageText(text)} value={messageText} onSubmitEditing={() => {}} />

                    <TouchableOpacity onPress={() => {}} style={{ backgroundColor: colors.pink, marginRight: 10, ...styles.attachmentButton}}>
                        <Entypo name="attachment" size={20} color="white" />
                    </TouchableOpacity>

                    {
                        messageText === "" ? (
                            <TouchableOpacity onPress={() => {}} style={{ backgroundColor: colors.primary, ...styles.attachmentButton}}>
                                <MaterialCommunityIcons name="microphone-outline" size={20} color="white" />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={sendMessageHandler} style={{ backgroundColor: colors.primary, ...styles.attachmentButton}}>
                                <Feather name="send" size={20} color="white" />
                            </TouchableOpacity>
                        )
                    }


                    {/* <AwesomeAlert 
                        show={tempImageUri !== ""}
                        title="Send image?"
                        closeOnTouchOutside={true}
                        closeOnHardwareBackPress={false}
                        showCancelButton={true}
                        showConfirmButton={true}
                        cancelText='Cancel'
                        confirmText='Send image'
                        confirmButtonColor={colors.primary}
                        cancelButtonColor={colors.red}
                        titleStyle={styles.popupTitleStyle}
                        onCancelPressed={() => setTempImageUri("")}
                        onConfirmPressed={uploadImage}
                        onDismiss={() => setTempImageUri("")}
                        customView={(
                            <View>
                                {
                                    isLoading && (
                                        <ActivityIndicator size="large" color={colors.primary} />
                                    )
                                }
                                {
                                    !isLoading && tempImageUri !== "" && (
                                        <Image source={{ uri: tempImageUri }} style={{ width: 200, height: 200 }} />
                                    )
                                }
                            </View>
                        )}
                    /> */}
                </View>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "column",
        backgroundColor: "white"
    },
    screen: {
        flex: 1
    },
    backgroundImage: {
        flex: 1,
    },
    inputContainer: {
        backgroundColor: "white",
        flexDirection: "row",
        paddingVertical: 8,
        paddingHorizontal: 10,
        height: 50,
        marginBottom: 10,
    },
    textbox: {
        flex: 1,
        borderRadius: 50,
        backgroundColor: colors.extraLightGrey,
        marginHorizontal: 15,
        paddingHorizontal: 20,
        height: 40,
        fontFamily: "regular",
        fontSize: 12,
        letterSpacing: 0.3,
    },
    attachmentButton: {
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 50,
        color: "white",
        width: 40,
        height: 40,
    },
    sendButton: {
        backgroundColor: colors.blue,
        borderRadius: 50,
        padding: 8,
        width: 35,
    },
    popupTitleStyle: {
        fontFamily: "medium",
        letterSpacing: 0.3,
        color: colors.textColor
    },
    headerTitleStyle: {
        fontFamily: "medium",
        color: "white",
        fontSize: 15,
        letterSpacing: 0.3,
        alignSelf: "center",
    },
})

export default ChatScreen;



