// Initial state
const initialState = {
    listBeers: [],
    listCities: [],
    chats: [],
    onlineusers: [],
    priv_chats: [],
    loading: {
        beers: false,
        cities: false,
        chats: false
    },
    errors: {
        beers: null,
        cities: null,
        chats: null
    }
};

export default function reducer(state = initialState, action) {
    switch (action.type) {
        // Beer actions
        case "GET_BEERS_START":
            return {
                ...state,
                loading: { ...state.loading, beers: true },
                errors: { ...state.errors, beers: null }
            };
        
        case "GET_BEERS_SUCCESS":
            return {
                ...state,
                listBeers: action.payload,
                loading: { ...state.loading, beers: false },
                errors: { ...state.errors, beers: null }
            };
        
        case "GET_BEERS_ERROR":
            return {
                ...state,
                loading: { ...state.loading, beers: false },
                errors: { ...state.errors, beers: action.payload }
            };

        // Cities actions
        case "GET_CITIES":
            return {
                ...state,
                listCities: action.payload
            };

        // Chat actions
        case "RECENT_CHATS":
            return {
                ...state,
                chats: action.payload
            };

        case "NEW_CHAT":
            return {
                ...state,
                chats: [...(state.chats || []), action.payload]
            };

        // Online users actions
        case "ONLINE_USERS":
            return {
                ...state,
                onlineusers: action.payload
            };

        // Private chat actions
        case "RECENT_PRIV_CHATS":
            return {
                ...state,
                priv_chats: action.payload
            };

        case "NEW_PRIV_CHAT":
            return {
                ...state,
                priv_chats: [...(state.priv_chats || []), action.payload]
            };

        default:
            return state;
    }
}
