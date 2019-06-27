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
        // console.log("cities list", list);
        store.dispatch(getCities(list));
    });

    socket.on("chatMessages", msgs => {
        store.dispatch(chatMessages(msgs));
    });

    socket.on("chatMessage", msg => {
        // console.log("message from backend", msg);

        store.dispatch(chatMessage(msg));
    });

    socket.on("userJoinedOrLeft", users => {
        // console.log("data coming from backend", users);

        store.dispatch(userJoinedOrLeft(users));
    });

    socket.on("privateChatMsgs", msgs => {
        // console.log("private messages received from backend", msgs);
        store.dispatch(privateChatMessages(msgs));
    });

    socket.on("privateChatMsg", msg => {
        // console.log(
        //     "private messages received from backend privateChatMsg",
        //     msg
        // );
        store.dispatch(privateChatMessage(msg));
    });

    return socket;
}
