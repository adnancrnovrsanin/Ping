import { StyleSheet, Text } from "react-native";
import PageContainer from "../components/PageContainer";

const CallsListScreen = (props: any) => {
    return (
        <PageContainer style={styles.container}>
            <Text>CallsListScreen</Text>
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

export default CallsListScreen;