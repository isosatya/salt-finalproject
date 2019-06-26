//////////////////// TESTING GITHUUBBB

const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./utils/db");
const bc = require("./utils/bc"); // BECRYPT FOR HASHING AND CHECKING PASSWORDS
var cookieSession = require("cookie-session");

////////////////////// SETTINGS FOR SOCKET (CHAT)
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: "localhost:8080 127.0.0.1:8080/"
});
///////////////////////////

//////////////////////////////////////////// Image upload settings
// const for constructing the url address
const urlPrefx = "https://s3.amazonaws.com/andres-spiced/";
// This is the module that uploads the image to Amazon
const s3 = require("./s3");
var multer = require("multer");
var uidSafe = require("uid-safe");
var path = require("path");
// This uploads the image to the local storate
var diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});
// These are the parameters for the upload
var uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152
    }
});
//////////////////////////////////////////// Cookie and Socket settings

app.use(cookieParser());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always angry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

////////////////////////////////

app.use(express.static(__dirname + "/public"));

app.use(
    bodyParser.urlencoded({
        extended: false
    })
);
app.use(bodyParser.json());
app.use(compression());

//////////////////////////////  Bundle Server

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

//////////////////////////////////////////////   Routes

app.post("/register", function(req, res) {
    let username = req.body.username;
    let age = req.body.age;
    let city = req.body.city;
    let email = req.body.email;
    let password = req.body.password;
    console.log("req. body registration form", req.body);

    // hashing the password with a function
    bc.hashPassword(password)
        .then(hash => {
            db.addUsers(username, age, city, email, hash)
                .then(results => {
                    // assigning user id from table to session cookie
                    req.session.usersId = results.rows[0].id;
                    // sending the user id to front end
                    res.json({ userId: results.rows[0].id });
                })
                .catch(err => {
                    if (err.code == 23505) {
                        // if email already exists send error
                        res.json({ error: 23505 });
                    } else {
                        // send general error
                        res.json({ error: true });
                    }
                    console.log("Error at addUsers query -->", err);
                });
        })
        .catch(err => {
            res.json({ error: true });
            console.log("Error at hashPassword function", err);
        });
});

app.post("/login", (req, res) => {
    // console.log("req. body for login", req.body);
    var email = req.body.email;
    var password = req.body.password;
    db.login(email)
        .then(match => {
            bc.checkPassword(password, match.rows[0].password)
                .then(doesMatch => {
                    if (doesMatch) {
                        req.session.usersId = match.rows[0].id;
                        res.json({ userId: match.rows[0].id });
                    } else {
                        res.json({ error: "Password incorrect!" });
                    }
                })
                .catch(err => {
                    console.log("Error at checkPassword query ->", err);
                });
        })
        .catch(err => {
            res.json({ error: "e-Mail not found!" });
            console.log("Error at login query ->", err);
        });
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

app.get("/delete", (req, res) => {
    const user = req.session.usersId;
    console.log("user for deleting profile", user);

    db.getPicsUserDatabase(user).then(results => {
        // console.log(results.rows);
        let images = results.rows.map(image => image.imgurl.slice(39));
        // console.log("images", images);
        s3.delete(images);
        db.deletePicsUserDatabase(user).then(() => {
            db.deleteUserFriendships(user).then(() => {
                db.deleteUser(user).then(() => {
                    console.log("user delete in backend");
                    req.session = null;
                    res.redirect("/");
                });
                // console.log("friendships deleted");
            });
        });
    });
});

// once user is logged in, sending the user info for rendering via the App component
app.get("/user", (req, res) => {
    db.getUserInfo(req.session.usersId)
        .then(results => {
            res.json(results.rows);
        })
        .catch(err => {
            console.log("Error at the getUserInfo Query", err);
        });
});

app.get("/otheruser/:id", (req, res) => {
    const id = req.params.id;

    db.getUserAndCellar(id)
        .then(results => {
            // console.log("results for getUserAndCellar", results.rows);

            res.json(results.rows);
        })
        .catch(err => {
            console.log("Error at the getUserAndCellar", err);
        });
});

app.get("/users/:val", (req, res) => {
    const val = req.params.val;

    if (val) {
        db.userSearch(val)
            .then(results => {
                if (results.rows.length == 0) {
                    res.json({ error: 2 });
                } else {
                    // console.log("results of search", results.rows);
                    res.json(results.rows);
                }
            })
            .catch(err => {
                console.log("Error at the userSearch query", err);
            });
    } else {
        res.redirect("/users/recent");
    }
});

app.post("/search_liked_beer/:id", (req, res) => {
    const loggedUserId = req.session.usersId;
    const beerId = req.params.id;
    db.searchLikedBeer(loggedUserId, beerId).then(results => {
        if (results.rows.length == 0) {
            // No frienship or friendship request
            res.json({ status: 1 });
        } else {
            res.json({ status: 2 });
        }
    });
});

app.post("/like_beer/:id", (req, res) => {
    const userId = req.session.usersId;
    const beerId = req.params.id;
    db.likeBeer(userId, beerId).then(results => {
        if (results.rows.length != 0) {
            res.json({ success: true });
        } else {
            res.json({ success: "" });
        }
    });
});

app.post("/dislike_beer/:id", (req, res) => {
    const userId = req.session.usersId;
    const beerId = req.params.id;
    db.dislikeBeer(userId, beerId).then(() => {
        res.json({ success: true });
    });
});

app.post("/upload", uploader.single("file"), s3.upload, function(req, res) {
    var url = urlPrefx + req.file.filename;
    var id = req.session.usersId;
    // updating profile pic in users table
    db.updateProfilePic(id, url)
        .then(() => {
            // adding pic to database for later deletion in s3 amazon of all user pics
            db.addPicDatabase(id, url);
            res.json(url);
        })
        .catch(err => console.log("Error at UpdateProfilePic", err));
});

app.get("/beers_list", (req, res) => {
    const id = req.session.usersId;
    db.likedBeersList(id).then(results => {
        // console.log("results for likedBeerList query", results.rows);
        res.json(results.rows);
    });
});

app.get("/welcome", function(req, res) {
    if (req.session.usersId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.get("*", function(req, res) {
    if (!req.session.usersId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// We change "app.listen" with "server.listen" so we can use the Socket functionality
// it's server, not app, that does the listening
server.listen(8080, function() {
    console.log("I'm listening.");
});

//////////////////////////////////////// Socket Events
// const onlineUsers = {};
// function dateFormat(date) {
//     return new Date(date).toLocaleString();
// }

// io.on("connection", function(socket) {
//     // console.log(`socket with the id ${socket.id} is now connected`);

//     if (!socket.request.session.usersId) {
//         return socket.disconnect(true);
//     }
//     const usersId = socket.request.session.usersId;
//     // console.log(
//     //     `socket with the id ${socket.id} is now connected with user ${usersId}`
//     // );
//     // console.log("online users", onlineUsers);

//     const onlineUsersArray = Object.values(onlineUsers);

//     const found = onlineUsersArray.find(user => {
//         return user == usersId;
//     });

//     if (!found) {
//         onlineUsers[socket.id] = usersId;
//     }

//     db.onlineUsersInfo(Object.values(onlineUsers)).then(results => {
//         // console.log("onlineUsersInfo query results", results.rows);
//         // socket.emit("onlineUsers", results.rows); //--> emit does the job
//         io.sockets.emit("userJoinedOrLeft", results.rows);
//     });

//     db.getRecentChats().then(results => {
//         // console.log("results for the getRecentChats query", results.rows);
//         results.rows.map(
//             item => (item.created_at = dateFormat(item.created_at))
//         );
//         // console.log("db.getRecentChats", results.rows);

//         socket.emit("chatMessages", results.rows.reverse());
//     });

//     socket.on("chatMessage", msg => {
//         // console.log("listened to chatMessage event ", msg);

//         db.addChatMsg(usersId, msg).then(results => {
//             // console.log("results for addChatMsg", results.rows);

//             db.getChatAndUserInfo(usersId, results.rows[0].id).then(results => {
//                 results.rows.map(
//                     item => (item.created_at = dateFormat(item.created_at))
//                 );

//                 io.sockets.emit("chatMessage", results.rows[0]);
//             });
//         });
//     });

//     socket.on("privateChatUser", user => {
//         // console.log("usersId who is logged in", usersId);
//         // console.log("other user from chat", user);
//         // console.log("online users table", onlineUsers);

//         function getSocketIdByUser(object, value) {
//             return Object.keys(object).find(key => object[key] === value);
//         }

//         const recipientSocketId = getSocketIdByUser(onlineUsers, user);
//         // console.log(`socketId for user ${user}`, recipientSocketId);

//         db.getRecentPrivateChats(usersId, user).then(results => {
//             if (user != usersId) {
//                 results.rows.map(
//                     item => (item.created_at = dateFormat(item.created_at))
//                 );

//                 // console.log("recent private chats", results.rows);

//                 io.sockets.sockets[recipientSocketId].emit(
//                     "privateChatMsgs",
//                     results.rows.reverse()
//                 );
//                 socket.emit("privateChatMsgs", results.rows);
//             }
//         });

//         socket.on("privateChatMessage", msg => {
//             // console.log("listened private to chatMessage event ", msg);

//             db.addPrivateChatMsg(usersId, user, msg).then(results => {
//                 // console.log("results for addChatMsg", results.rows);
//                 db.getPrivateChatAndUserInfo(usersId, results.rows[0].id).then(
//                     results => {
//                         // console.log(
//                         //     "getPrivateChatAndUserInfo results",
//                         //     results.rows[0]
//                         // );
//                         results.rows.map(
//                             item =>
//                                 (item.created_at = dateFormat(item.created_at))
//                         );
//                         io.sockets.emit("privateChatMsg", results.rows[0]);
//                     }
//                 );
//             });
//         });
//     });

//     socket.on("disconnect", function() {
//         // console.log(
//         //     `socket with the id ${
//         //         socket.id
//         //     } is now disconnected with user ${usersId}`
//         // );

//         delete onlineUsers[socket.id];

//         db.onlineUsersInfo(Object.values(onlineUsers)).then(results => {
//             // console.log("onlineUsersInfo query results", results.rows);
//             socket.emit("onlineUsers", results.rows);
//             io.sockets.emit("userJoinedOrLeft", results.rows);
//         });
//     });

//     // socket.on("thanks", function(data) {
//     //     console.log(data);
//     // });
//     // socket.emit("welcome", {
//     //     message: "Welome. It is nice to see you"
//     // });
// });
