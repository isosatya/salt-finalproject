import axios from "./axios";

// Action creators for beer cellar
export function getCellar() {
    return async (dispatch) => {
        try {
            dispatch({ type: "GET_BEERS_START" });
            const { data } = await axios.get("/beers_list");
            dispatch({ type: "GET_BEERS_SUCCESS", payload: data });
        } catch (error) {
            dispatch({ type: "GET_BEERS_ERROR", payload: error.message });
        }
    };
}

// Action creators for cities
export function getCities(list) {
    return {
        type: "GET_CITIES",
        payload: list
    };
}

// Action creators for online users
export function userJoinedOrLeft(users) {
    return {
        type: "ONLINE_USERS",
        payload: users
    };
}

// Action creators for chat messages
export function chatMessages(msgs) {
    return {
        type: "RECENT_CHATS",
        payload: msgs
    };
}

export function chatMessage(msg) {
    return {
        type: "NEW_CHAT",
        payload: msg
    };
}

// Action creators for private chat messages
export function privateChatMessages(priv_msgs) {
    return {
        type: "RECENT_PRIV_CHATS",
        payload: priv_msgs
    };
}

export function privateChatMessage(priv_msg) {
    return {
        type: "NEW_PRIV_CHAT",
        payload: priv_msg
    };
}
