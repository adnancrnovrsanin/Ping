import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View, Image, StyleSheet } from "react-native"
import { useDispatch } from "react-redux";
import colors from "../constants/colors";
const userImage = require("../assets/images/userImage.jpeg");

const ProfileImage = (props: any) => {
    const dispatch = useDispatch();

    const source = props.uri ? { uri: props.uri } : userImage;

    const [image, setImage] = useState(source);
    const [isLoading, setIsLoading] = useState(false);

    const showEditButton = props.showEditButton && props.showEditButton === true;
    const showRemoveButton = props.showRemoveButton && props.showRemoveButton === true;

    const pickImage = async () => {
        try {
            return;
        } catch (error) {
            console.log();
        }
    }
    
    const Container = (props.onPress || showEditButton) ? TouchableOpacity : View;

    return (
        // @ts-ignore
        <Container
            style={props.style}
            onPress={props.onPress || pickImage}
        >
            {
                isLoading ? (
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="small" color={colors.primary} />
                    </View>
                ) : (
                    <Image 
                        style={{
                            ...styles.image,
                            ...{
                                width: props.size,
                                height: props.size,
                            }
                        }}
                        source={image}
                    />
                )
            }
        </Container>
    );
}

const styles = StyleSheet.create({
    image: {
        borderRadius: 50,
        borderColor: colors.grey,
        borderWidth: 1,
    },
    editIconContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.lightGrey,
        borderRadius: 20,
        padding: 8,
    },
    loadingContainer: {
        justifyContent: "center",
        alignItems: "center",
    },
    removeIconContainer: {
        position: "absolute",
        bottom: 0,
        right: 0,
        backgroundColor: colors.lightGrey,
        borderRadius: 20,
        padding: 3,
    }
});

export default ProfileImage;