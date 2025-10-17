import axios from "./axios";

export function getCellar() {
    return {
        type: "GET_BEERS"
    };
}

export function getCities(list) {
    return {
        type: "GET_CITIES",
        citiesList: list
    };
}

export function userJoinedOrLeft(users) {
    return {
        type: "ONLINE_USERS",
        onlineusers: users
    };
}

export function chatMessages(msgs) {
    return {
        type: "RECENT_CHATS",
        chats: msgs
    };
}

export function chatMessage(msg) {
    return {
        type: "NEW_CHAT",
        chat: msg
    };
}

export function privateChatMessages(priv_msgs) {
    return {
        type: "RECENT_PRIV_CHATS",
        priv_chats: priv_msgs
    };
}

export function privateChatMessage(priv_msg) {
    return {
        type: "NEW_PRIV_CHAT",
        priv_chat: priv_msg
    };
}
