import { ActivityIndicator, FlatList, ImageBackground, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import PageContainer from "../components/PageContainer";
import React, { useEffect, useState } from "react";
import { HeaderButtons, Item } from "react-navigation-header-buttons";
import CustomHeaderButton from "../components/CustomHeaderButton";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import { isLoading } from "expo-font";
import AwesomeAlert from "react-native-awesome-alerts";
import colors from "../constants/colors";

const ChatScreen = (props: any) => {
    const [messageText, setMessageText] = useState("");

    useEffect(() => {
        props.navigation.setOptions({
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
                            onPress={() => {}}
                        />
                    </HeaderButtons>
                );
            }
        });
    }, []) ;

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView style={styles.screen} behavior={ Platform.OS === "ios" ? "padding" : undefined } keyboardVerticalOffset={100}>

                <PageContainer style={styles.backgroundImage}>
                </PageContainer>

                <View style={styles.inputContainer}>
                    <TextInput style={styles.textbox} placeholder="Write a message..." onChangeText={text => setMessageText(text)} value={messageText} onSubmitEditing={() => {}} />

                    <TouchableOpacity onPress={() => {}} style={{ backgroundColor: colors.pink, marginRight: 10, ...styles.attachmentButton}}>
                        <Entypo name="attachment" size={20} color="white" />
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {}} style={{ backgroundColor: colors.primary, ...styles.attachmentButton}}>
                        <MaterialCommunityIcons name="microphone-outline" size={20} color="white" />
                    </TouchableOpacity>


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
    }
})

export default ChatScreen;