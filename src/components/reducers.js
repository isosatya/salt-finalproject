
// Redux reducer for managing application state
export default function reducer(state = {}, action) {
    // Updates the user's beer cellar list
    if (action.type === "GET_BEERS") {
        return {
            ...state,
            listBeers: action.beersList
        };
    }

    // Updates the list of available cities
    if (action.type === "GET_CITIES") {
        return {
            ...state,
            listCities: action.citiesList
        };
    }

    // Loads recent chat messages
    if (action.type === "RECENT_CHATS") {
        return {
            ...state,
            chats: action.chats
        };
    }

    // Adds a new chat message to the existing list
    if (action.type === "NEW_CHAT") {
        return {
            ...state,
            chats: [...state.chats, action.chat]
        };
    }

    // Updates the list of online users
    if (action.type === "ONLINE_USERS") {
        return {
            ...state,
            onlineusers: action.onlineusers
        };
    }

    // Loads recent private chat messages
    if (action.type === "RECENT_PRIV_CHATS") {
        return {
            ...state,
            priv_chats: action.priv_chats
        };
    }

    // Adds a new private chat message to the existing list
    if (action.type === "NEW_PRIV_CHAT") {
        return {
            ...state,
            priv_chats: [...state.priv_chats, action.priv_chat]
        };
    }


    return state;
}
