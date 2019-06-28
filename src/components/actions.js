import axios from "./axios";

export async function getCellar() {
    const { data } = await axios.get("/beers_list");
    // console.log("beers list query results", data);

    return {
        type: "GET_BEERS",
        beersList: data
    };
}

export async function getCities(list) {
    return {
        type: "GET_CITIES",
        citiesList: list
    };
}

export async function userJoinedOrLeft(users) {
    return {
        type: "ONLINE_USERS",
        onlineusers: users
    };
}

export async function chatMessages(msgs) {
    return {
        type: "RECENT_CHATS",
        chats: msgs
    };
}

export async function chatMessage(msg) {
    return {
        type: "NEW_CHAT",
        chat: msg
    };
}

export async function privateChatMessages(priv_msgs) {
    return {
        type: "RECENT_PRIV_CHATS",
        priv_chats: priv_msgs
    };
}

export async function privateChatMessage(priv_msg) {
    return {
        type: "NEW_PRIV_CHAT",
        priv_chat: priv_msg
    };
}
