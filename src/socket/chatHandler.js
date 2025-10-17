// Socket.io chat event handlers
const db = require("../../utils/db");
const CONFIG = require("../config/constants");

// Format date for display
function formatDate(date) {
    return new Date(date).toLocaleString();
}

// Handle socket connection and events
function setupSocketHandlers(io, onlineUsers) {
    io.on("connection", function(socket) {
        // Check if user is authenticated
        if (!socket.request.session.usersId) {
            return socket.disconnect(true);
        }

        const usersId = socket.request.session.usersId;
        const onlineUsersArray = Object.values(onlineUsers);
        const found = onlineUsersArray.find(user => user === usersId);

        if (!found) {
            onlineUsers[socket.id] = usersId;
        }

        // Send online users info
        db.onlineUsersInfo(Object.values(onlineUsers)).then(results => {
            io.sockets.emit("userJoinedOrLeft", results.rows);
        });

        // Send cities list
        db.getCities().then(results => {
            io.sockets.emit("citiesList", results.rows);
        });

        // Handle city-based chat
        socket.on("chatByCity", async (city) => {
            try {
                const results = await db.onlineUsersInfoByCity(Object.values(onlineUsers));
                const filtered = results.rows.filter(result => result.city === city);

                io.sockets.emit("userJoinedOrLeft", filtered);
                
                const chatResults = await db.getRecentChatsCity(city);
                chatResults.rows.forEach(item => {
                    item.created_at = formatDate(item.created_at);
                });

                socket.emit("chatMessages", chatResults.rows.reverse());
            } catch (error) {
                console.error("Error in chatByCity:", error);
            }
        });

        // Handle chat refresh
        socket.on("refreshChats", async () => {
            try {
                const results = await db.getRecentChats();
                results.rows.forEach(item => {
                    item.created_at = formatDate(item.created_at);
                });
                
                socket.emit("chatMessages", results.rows.reverse());

                const onlineResults = await db.onlineUsersInfo(Object.values(onlineUsers));
                io.sockets.emit("userJoinedOrLeft", onlineResults.rows);
            } catch (error) {
                console.error("Error in refreshChats:", error);
            }
        });

        // Send recent chats on connection
        db.getRecentChats().then(results => {
            results.rows.forEach(item => {
                item.created_at = formatDate(item.created_at);
            });
            socket.emit("chatMessages", results.rows.reverse());
        });

        // Handle new chat message
        socket.on("chatMessage", async (msg) => {
            try {
                const results = await db.addChatMsg(usersId, msg);
                const chatResults = await db.getChatAndUserInfo(usersId, results.rows[0].id);
                
                chatResults.rows.forEach(item => {
                    item.created_at = formatDate(item.created_at);
                });

                io.sockets.emit("chatMessage", chatResults.rows[0]);
            } catch (error) {
                console.error("Error in chatMessage:", error);
            }
        });

        // Handle private chat user selection
        socket.on("privateChatUser", async (user) => {
            try {
                // Find socket ID of the recipient
                function getSocketIdByUser(object, value) {
                    return Object.keys(object).find(key => object[key] === value);
                }

                const recipientSocketId = getSocketIdByUser(onlineUsers, user);

                const results = await db.getRecentPrivateChats(usersId, user);
                
                if (user !== usersId) {
                    results.rows.forEach(item => {
                        item.created_at = formatDate(item.created_at);
                    });

                    if (recipientSocketId && io.sockets.sockets[recipientSocketId]) {
                        io.sockets.sockets[recipientSocketId].emit(
                            "privateChatMsgs",
                            results.rows.reverse()
                        );
                    }
                    socket.emit("privateChatMsgs", results.rows);
                }

                // Handle private chat message
                socket.on("privateChatMessage", async (msg) => {
                    try {
                        const results = await db.addPrivateChatMsg(usersId, user, msg);
                        const chatResults = await db.getPrivateChatAndUserInfo(
                            usersId,
                            results.rows[0].id
                        );
                        
                        chatResults.rows.forEach(item => {
                            item.created_at = formatDate(item.created_at);
                        });

                        if (recipientSocketId && io.sockets.sockets[recipientSocketId]) {
                            io.sockets.sockets[recipientSocketId].emit(
                                "privateChatMsg",
                                chatResults.rows[0]
                            );
                        }
                        socket.emit("privateChatMsg", chatResults.rows[0]);
                    } catch (error) {
                        console.error("Error in privateChatMessage:", error);
                    }
                });
            } catch (error) {
                console.error("Error in privateChatUser:", error);
            }
        });

        // Handle disconnect
        socket.on("disconnect", async () => {
            delete onlineUsers[socket.id];

            try {
                const results = await db.onlineUsersInfo(Object.values(onlineUsers));
                io.sockets.emit("userJoinedOrLeft", results.rows);
            } catch (error) {
                console.error("Error in disconnect:", error);
            }
        });
    });
}

module.exports = { setupSocketHandlers };
