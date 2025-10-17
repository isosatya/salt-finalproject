const express = require("express");
const app = express();
const compression = require("compression");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cookieSession = require("cookie-session");
const csurf = require("csurf");

// Import configuration and modules
const CONFIG = require("./src/config/constants");
const { setupSocketHandlers } = require("./src/socket/chatHandler");
const { attachUserInfo } = require("./src/middleware/auth");

// Import route modules
const authRoutes = require("./src/routes/auth");
const beerRoutes = require("./src/routes/beer");
const uploadRoutes = require("./src/routes/upload");

// Socket.io setup
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    origins: CONFIG.SOCKET_ORIGINS
});

// Middleware setup
app.use(cookieParser());

const cookieSessionMiddleware = cookieSession({
    secret: CONFIG.SESSION_SECRET,
    maxAge: CONFIG.SESSION_MAX_AGE
});

app.use(cookieSessionMiddleware);

io.use(function(socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

// CSRF protection
app.use(csurf());
app.use(function(req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// Static files and body parsing
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(compression());

// Attach user info to requests
app.use(attachUserInfo);

// Bundle server configuration
if (process.env.NODE_ENV !== "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/"
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// Route handlers
app.use("/", authRoutes);
app.use("/", beerRoutes);
app.use("/", uploadRoutes);

// Welcome page (for unauthenticated users)
app.get("/welcome", (req, res) => {
    if (req.session.usersId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// Catch-all route (for authenticated users)
app.get("*", (req, res) => {
    if (!req.session.usersId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// Initialize socket handlers
const onlineUsers = {};
setupSocketHandlers(io, onlineUsers);

// Start server
server.listen(process.env.PORT || 8080, function() {
    console.log("Server listening on port", process.env.PORT || 8080);
});
