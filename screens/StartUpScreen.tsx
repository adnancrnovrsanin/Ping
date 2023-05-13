import { View, ActivityIndicator } from "react-native";
import commonStyles from "../constants/commonStyles";
import colors from "../constants/colors";

const StartUpScreen = (props: any) => {
    return (
        <View style={commonStyles.center}>
            <ActivityIndicator size="large" color={colors.primary} />
        </View>
    ); 
};

export default StartUpScreen;

