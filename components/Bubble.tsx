import { StyleSheet, View, TouchableWithoutFeedback, Text } from "react-native"
import colors from "../constants/colors";
import { StyleHTMLAttributes, useRef } from "react";
import uuid from "react-native-uuid";
import * as Clipboard from 'expo-clipboard';
import * as Haptics from 'expo-haptics';
import { Menu, MenuOption, MenuOptions, MenuTrigger } from "react-native-popup-menu";
import { Feather } from "@expo/vector-icons";
import { useSelector } from "react-redux";
import { RootState } from "../stores/store";

function formatAmPm(dateString: string) {
    const date = new Date(dateString);
    var hours = date.getHours();
    var minutes: any = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    return hours + ':' + minutes + ' ' + ampm;
}

const MenuItem = (props: any) => {

    const Icon = props.iconPack ?? Feather;

    return (
        <MenuOption onSelect={props.onSelect}>
            <View style={styles.menuItemContainer}>
                <Text style={styles.menuText}>{props.text}</Text>
                <Icon name={props.icon} size={20} />
            </View>
        </MenuOption>
    );
}

const Bubble = (props: any) => {

    const { text, type, messageId, chatId, userId, date, setReply, replyingTo, name, imageUrl } = props;

    // const starredMessages = useSelector((state: RootState) => state.messages.starredMessages[chatId] ?? {});
    // const storedUsers = useSelector((state: RootState) => state.users.storedUsers);

    const bubbleStyle: any = {
        ...styles.container,
    };

    const textStyle: any = {
        ...styles.text,
    };

    const wrapperStyle: any = {
        ...styles.wrapperStyle,
    };

    const menuRef = useRef(null);
    const id = useRef(uuid.v4());
    // @ts-ignore
    if (!type) type = ""; 

    let Container: any = View;

    switch(type) {
        case "system":
            textStyle.color = "#65644A";
            bubbleStyle.backgroundColor = colors.beige;
            bubbleStyle.alignItems = "center";
            bubbleStyle.marginTop = 10;
            break;
        case "error":
            bubbleStyle.backgroundColor = colors.red;
            textStyle.color = "white";
            bubbleStyle.marginTop = 10;
            break;
        case "sent":
            wrapperStyle.justifyContent = "flex-end";
            bubbleStyle.backgroundColor = colors.primary;
            bubbleStyle.maxWidth = "90%";
            textStyle.color = "white";
            Container = TouchableWithoutFeedback;
            break;
        case "received":
            wrapperStyle.justifyContent = "flex-start";
            bubbleStyle.maxWidth = "90%";
            bubbleStyle.backgroundColor = colors.extraLightGrey;
            Container = TouchableWithoutFeedback;
            break;
        case "reply":
            bubbleStyle.backgroundColor = "#F2F2F2";
            break;
        case "info":
            bubbleStyle.backgroundColor = "white";
            bubbleStyle.alignItems = "center";
            textStyle.color = colors.textColor;
            textStyle.textAlign = "center";
            textStyle.fontSize = 10;
            bubbleStyle.marginTop = 10;
            bubbleStyle.marginBottom = 20;
            break;
        default:
            break;
    }

    const copyToClipboard = async () => await Clipboard.setStringAsync(text);

    // const isStarred = starredMessages[messageId] !== undefined;

    const dateString = date && formatAmPm(date);

    // const replyingToUser = replyingTo && storedUsers[replyingTo.sentBy];

    return (
        <View style={wrapperStyle}>
            <Container style={{ width: "100%" }} onLongPress={() => {
                Haptics.selectionAsync();
                // @ts-ignore
                menuRef.current.props.ctx.menuActions.openMenu(id.current);
            }}>
                <View style={bubbleStyle}>

                    {
                        name && !["system", "info"].includes(type) && (
                            <Text style={{color: type === "received" ? colors.textColor : "white", ...styles.name}}>
                                {name}
                            </Text>
                        )
                    }

                    {/* {
                        replyingToUser && (
                            <Bubble 
                                type="reply"
                                text={replyingTo.text}
                                name={`${replyingToUser.firstName} ${replyingToUser.lastName}`}
                            />
                        )
                    } */}

                    {
                        !imageUrl && (
                            <Text style={textStyle}>
                                {text}
                            </Text>
                        )
                    }

                    {/* {
                        imageUrl && <Image source={{ uri: imageUrl }} style={styles.image} />
                    } */}

                    {
                        dateString && !["system", "info"].includes(type) && <View style={styles.timeContainer}>
                            {/* { isStarred && <FontAwesome name="star" size={14} color={colors.textColor} style={{ marginRight: 5 }} /> } */}
                            <Text style={styles.time}>
                                {dateString}
                            </Text>
                        </View>
                    }

                    <Menu name={id.current as string} ref={menuRef}>
                        <MenuTrigger />

                        <MenuOptions>
                            <MenuItem text="Copy to clipboard" icon="copy" onSelect={copyToClipboard} />
                            {/* <MenuItem text={`${isStarred ? 'Unstar' : 'Star'} message`} icon={isStarred ? 'star' : 'star-o'} iconPack={FontAwesome} onSelect={() => starMessage(messageId, chatId, userId)} /> */}
                            <MenuItem text="Reply" icon="corner-up-left" onSelect={setReply} />
                        </MenuOptions>
                    </Menu>
                </View>
            </Container>
        </View>
    )
}

const styles = StyleSheet.create({
    wrapperStyle: {
        flexDirection: "row",
        justifyContent: "center",
    },
    text: {
        fontFamily: "regular",
        letterSpacing: 0.3,
    },
    container: {
        backgroundColor: "white",
        borderRadius: 6,
        padding: 5,
        marginBottom: 10,
    },
    menuItemContainer: {
        flexDirection: "row",
        padding: 5
    },
    menuText: {
        flex: 1,
        fontFamily: "regular",
        letterSpacing: 0.3,
        fontSize: 16,
    },
    timeContainer: {
        flexDirection: "row",
        justifyContent: "flex-end",
    },
    time: {
        fontFamily: "regular",
        letterSpacing: 0.3,
        color: colors.grey,
        fontSize: 12,
    },
    name: {
        fontFamily: "medium",
        letterSpacing: 0.3
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 5,
    }
});

export default Bubble;