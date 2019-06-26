// if (action.type === "ADD_LIST_ANIMALS") {
//     // here i tell the reducer how to add the list of animals to global state
//     // ALWAYS consol log the action to check
//     // console.log(("action:", action));
//     return {
//         ...state,
//         // call the property however you want
//         listAnimals: action.listAnimals
//     };
// }

export default function reducer(state = {}, action) {
    if (action.type === "GET_BEERS") {
        return {
            ...state,
            listBeers: action.beersList
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

    // console.log("state at reducer", state);

    return state;
}
