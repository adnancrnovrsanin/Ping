import React from "react";
import { KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View, Image } from "react-native";
import PageContainer from "../components/PageContainer";
import colors from "../constants/colors";
const logo = require("../assets/images/logo.png");

const AuthScreen = () => {
    return (
        <SafeAreaView style={{ flex: 1 }}>
            <PageContainer>
                <ScrollView>
                    <KeyboardAvoidingView style={styles.keyboardAvoidingView} behavior={ Platform.OS === 'ios' ? "height" : undefined } keyboardVerticalOffset={100}>

                        <View style={styles.imageContainer}>
                            <Image source={logo} style={styles.image} />
                        </View>
                    </KeyboardAvoidingView>
                </ScrollView>
            </PageContainer>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    linkContainer: {
        justifyContent: "center",
        alignItems: "center",
        marginVertical: 15,
    },
    link: {
        color: colors.blue,
        fontFamily: "medium",
        letterSpacing: 0.3,
    },
    imageContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    image: {
        width: "50%",
        resizeMode: "contain",
        height: 150,
        margin: 40
    },
    keyboardAvoidingView: {
        flex: 1,
        justifyContent: "center",
    }
})

export default AuthScreen;