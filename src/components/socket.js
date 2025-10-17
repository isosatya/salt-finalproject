import * as io from "socket.io-client";
import { chatMessages } from "./actions";
import { chatMessage } from "./actions";
import { onlineUsers } from "./actions";
import { userJoinedOrLeft } from "./actions";
import { privateChatMessages } from "./actions";
import { privateChatMessage } from "./actions";
import { getCities } from "./actions";

export let socket;

export function initSocket(store) {
    if (!socket) {
        socket = io.connect();
    }

    socket.on("citiesList", list => {
        store.dispatch(getCities(list));
    });

    socket.on("chatMessages", msgs => {
        store.dispatch(chatMessages(msgs));
    });

    socket.on("chatMessage", msg => {
        store.dispatch(chatMessage(msg));
    });

    socket.on("userJoinedOrLeft", users => {
        store.dispatch(userJoinedOrLeft(users));
    });

    socket.on("privateChatMsgs", msgs => {
        store.dispatch(privateChatMessages(msgs));
    });

    socket.on("privateChatMsg", msg => {
        store.dispatch(privateChatMessage(msg));
    });

    return socket;
}
