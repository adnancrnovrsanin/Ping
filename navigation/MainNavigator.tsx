import { StyleSheet, Text, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useEffect, useRef, useState } from "react";
import ChatListScreen from "../screens/ChatListScreen";
import ChatScreen from "../screens/ChatScreen";
import CallsListScreen from "../screens/CallsListScreen";
import { NavigationContainer, useNavigation } from "@react-navigation/native";
import { LinearGradient } from "expo-linear-gradient";
import colors from "../constants/colors";
import NewChatScreen from "../screens/NewChatScreen";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../stores/store";
import { getUserChats } from "../utils/actions/chatActions";
import { setUserChatsData } from "../stores/chatsSlice";

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
                tabBarItemStyle: {
                    borderRadius: 20,
                },
            }}
        >
            <Tab.Screen name="ChatList" component={ChatListScreen} options={{
                tabBarShowLabel: false,
                headerTitle: "Ping",
                tabBarIcon: ({ color, size }) => <MaterialIcons name="chat-bubble" size={ size } color={ color } />
            }} />
            <Tab.Screen name="CallsList" component={CallsListScreen} options={{
                tabBarShowLabel: false,
                headerTitle: "Ping",
                tabBarIcon: ({ color, size }) => <MaterialIcons name="phone" size={ size } color={ color } />
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
                        fontSize: 15
                    },
                    headerTintColor: "white",
                }}
            />

            <Stack.Group screenOptions={{ presentation: "containedModal" }}>
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
    // console.log(expoPushToken);
    const notificationListener = useRef();
    const responseListener = useRef();

    useEffect(() => {
        (
            async () => {
                if (userData) await getUserChats(userData.phoneNumber);
            }
        )();
    }, [userData]);

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