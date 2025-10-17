import axios from "./axios";

// Redux action creators for managing application state

// Triggers fetching user's beer cellar from the database
export function getCellar() {
    return {
        type: "GET_BEERS"
    };
}

// Updates the list of available cities for chat filtering
export function getCities(list) {
    return {
        type: "GET_CITIES",
        citiesList: list
    };
}

// Updates the list of currently online users
export function userJoinedOrLeft(users) {
    return {
        type: "ONLINE_USERS",
        onlineusers: users
    };
}

// Loads recent chat messages into the store
export function chatMessages(msgs) {
    return {
        type: "RECENT_CHATS",
        chats: msgs
    };
}

// Adds a new chat message to the store
export function chatMessage(msg) {
    return {
        type: "NEW_CHAT",
        chat: msg
    };
}

// Loads recent private chat messages
export function privateChatMessages(priv_msgs) {
    return {
        type: "RECENT_PRIV_CHATS",
        priv_chats: priv_msgs
    };
}

// Adds a new private chat message to the store
export function privateChatMessage(priv_msg) {
    return {
        type: "NEW_PRIV_CHAT",
        priv_chat: priv_msg
    };
}
