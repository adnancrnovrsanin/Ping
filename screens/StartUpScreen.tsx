import { View, ActivityIndicator } from "react-native";
import commonStyles from "../constants/commonStyles";
import colors from "../constants/colors";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { authenticate, setDidTryAutoLogin } from "../stores/authSlice";

const StartUpScreen = (props: any) => {
    const dispatch = useDispatch();

    useEffect(() => {
        (
            async () => {
                const storedAuthInfo = await AsyncStorage.getItem("userData");

                if (!storedAuthInfo) {
                    dispatch(setDidTryAutoLogin());
                    return;
                }

                const { token, userId, expiryDate: expiryDateString } = JSON.parse(storedAuthInfo);

                const expiryDate = new Date(expiryDateString);

                if (expiryDate <= new Date() || !token || !userId) {
                    dispatch(setDidTryAutoLogin());
                    return;
                }

                dispatch(authenticate({ token, userId, expiryDate }));
            }
        )();
    }, [dispatch]);

    return (
        <View style={commonStyles.center}>
            <ActivityIndicator size="large" color={colors.lightBlueGreen} />
        </View>
    ); 
};

export default StartUpScreen;

