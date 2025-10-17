
export default function reducer(state = {}, action) {
    if (action.type === "GET_BEERS") {
        return {
            ...state,
            listBeers: action.beersList
        };
    }

    if (action.type === "GET_CITIES") {
        return {
            ...state,
            listCities: action.citiesList
        };
    }

    if (action.type === "RECENT_CHATS") {
        return {
            ...state,
            chats: action.chats
        };
    }

    if (action.type === "NEW_CHAT") {
        return {
            ...state,
            // concat or spread operator
            chats: [...state.chats, action.chat]
        };
    }

    if (action.type === "ONLINE_USERS") {
        return {
            ...state,
            onlineusers: action.onlineusers
        };
    }

    if (action.type === "RECENT_PRIV_CHATS") {
        return {
            ...state,
            priv_chats: action.priv_chats
        };
    }

    if (action.type === "NEW_PRIV_CHAT") {
        return {
            ...state,
            // concat or spread operator
            priv_chats: [...state.priv_chats, action.priv_chat]
        };
    }


    return state;
}
