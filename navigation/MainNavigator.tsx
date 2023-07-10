import { Platform, StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Entypo, MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import CallsListScreen from "../screens/CallsListScreen";
import { NavigationContainer, StackActions, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { getUserChats } from "../utils/actions/chatActions";
import { setUserChatsData } from "../stores/chatsSlice";
import * as Contacts from "expo-contacts";
import { StoredContacts, setStoredContacts } from "../stores/contactsSlice";
import { CheckUserResponse, User } from "../models/UserModels";
import { checkIfUserExists } from "../utils/actions/userActions";
import agent from "../api/agent";
import NewGroupChatScreen from "../screens/NewGroupChatScreen";
import NewChatScreen from "../screens/NewChatScreen";
import SettingsScreen from "../screens/SettingsScreen";
import ChatSettingsScreen from "../screens/ChatSettingsScreen";
import ContactScreen from "../screens/ContactScreen";
import * as Notifications from "expo-notifications";
import * as Device from "expo-device";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    return (
        <Tab.Navigator
            screenOptions={{
                headerShadowVisible: false,
                headerBackground: (props: any) => {
                    return (
                        <LinearGradient
                            colors={[colors.pink, colors.primary]}
                            start={[0, 0]}
                            end={[1, 1]}
                            style={{ flex: 1 }}
                        />
                    );
                },
                headerTitleStyle: {
                    fontFamily: "bold",
                    fontSize: 24,
                    color: "white",
                },
                tabBarVisibilityAnimationConfig: {
                    show: {
                        animation: "timing",
                        config: {
                            duration: 300,
                            easing: () => 1,
                        }
                    }
                },
                tabBarActiveBackgroundColor: colors.pink,
                tabBarActiveTintColor: "white",
                tabBarInactiveTintColor: colors.textColor,
                tabBarStyle: {
                    elevation: 0,
                    borderTopWidth: 0,
                },
            }}
        >
            <Tab.Screen name="ChatList" component={ChatListScreen} options={{
                tabBarShowLabel: false,
                headerTitle: "Ping",
                tabBarIcon: ({ color, size }) => <Entypo name="chat" size={size} color={color} />
            }} />
        </Tab.Navigator>
    );
}

const StackNavigator = () => {
    return (
        <Stack.Navigator>
            <Stack.Screen 
                name="Home" 
                component={TabNavigator}
                options={{
                    headerShown: false,
                }}
            />
            <Stack.Screen 
                name="ChatScreen" 
                component={ChatScreen}
                options={{
                    headerShadowVisible: false,
                    headerBackground: () => {
                        return (
                            <LinearGradient
                                colors={[colors.pink, colors.primary]}
                                start={[0, 0]}
                                end={[1, 1]}
                                style={{ flex: 1 }}
                            />
                        );
                    },
                    headerTitleStyle: {
                        fontFamily: "medium",
                        color: "white",
                        fontSize: 16
                    },
                    headerTintColor: "white",
                    gestureEnabled: true,
                }}
            />

            <Stack.Screen 
                name="Settings"
                component={SettingsScreen}
            />

            <Stack.Screen 
                name="ChatSettings"
                component={ChatSettingsScreen}
            />

            <Stack.Screen 
                name="Contact"
                component={ContactScreen}
            />

            <Stack.Group screenOptions={{ presentation: "containedModal" }}>
                <Stack.Screen 
                    name="NewGroupChat"
                    component={NewGroupChatScreen}
                />
                <Stack.Screen 
                    name="NewChat"
                    component={NewChatScreen}
                />
            </Stack.Group>
        </Stack.Navigator>
    );
}

const MainNavigator = (props: any) => {
    const dispatch = useDispatch();
    const navigation = useNavigation();

    const [isLoading, setIsLoading] = useState(true);
    const userData = useSelector((state: RootState) => state.auth.userData);
    const storedUsers = useSelector((state: RootState) => state.users.storedUsers);

    const [expoPushToken, setExpoPushToken] = useState('');
    console.log(expoPushToken);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        registerForPushNotificationsAsync().then(token => setExpoPushToken(token!));

        // @ts-ignore
        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            // Handle received notification
        });

        // @ts-ignore
        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            // const { data } = response.notification.request.content;
            // const chatId = data["chatId"];

            // if (chatId) {
            //     const pushAction = StackActions.push("ChatScreen", { chatId });
            //     navigation.dispatch(pushAction);
            // } else console.log("No chat found in notification data");
            console.log(response);
        });

        return () => {
            // @ts-ignore
            Notifications.removeNotificationSubscription(notificationListener.current);
            // @ts-ignore
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);

    useEffect(() => {
        (
            async () => {
                if (userData) {
                    setIsLoading(true);

                    

                    await Contacts.requestPermissionsAsync();
                    const { data } = await Contacts.getContactsAsync({
                        fields: [Contacts.Fields.PhoneNumbers],
                    });

                    let contacts: any = {};
                    if (data.length > 0) {
                        for (let i = 0; i < data.length; i++) {
                            const contact = data[i];
                            if (contact.phoneNumbers && contact.phoneNumbers.length > 0) {
                                for (let j = 0; j < contact.phoneNumbers.length; j++) {
                                    const phoneNumber = contact.phoneNumbers[j];
                                    if (phoneNumber.number) {
                                        let number = phoneNumber.number.replaceAll(/[\s\-\(\)]/g, "");
                                        if (number?.startsWith("0")) number = "+381" + number.substring(1);

                                        if (!contacts[number]) contacts[number] = contact.name;
                                    }
                                }
                            }
                        }
                    }

                    try {
                        // console.log(Object.keys(contacts));
                        const result = await agent.Account.checkIfUsersExist(Object.keys(contacts));

                        result.map((user: User) => user.displayName = contacts[user.phoneNumber] ?? user.displayName);

                        if (result) dispatch(setStoredContacts({ newContacts: result }));
                    } catch (error) {
                        console.log(error);
                    }

                    setIsLoading(false);
                }
            }
        )();
    }, [userData]);

    if (isLoading) return (
        <View style={ styles.container }>
            <Text style={ styles.label }>Loading contacts...</Text>
        </View>
    );

    return (
        <StackNavigator />
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        textAlign: "center",
    },
    label: {
        fontSize: 18,
        fontFamily: "regular",
    }
});

export default MainNavigator;

async function registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log(token);
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}