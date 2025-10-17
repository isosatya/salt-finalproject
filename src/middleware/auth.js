// Authentication middleware
const db = require("../../utils/db");

// Middleware to check if user is authenticated
function requireAuth(req, res, next) {
    if (!req.session.usersId) {
        return res.status(401).json({ error: "Authentication required" });
    }
    next();
}

// Middleware to check if user is not authenticated (for login/register pages)
function requireGuest(req, res, next) {
    if (req.session.usersId) {
        return res.redirect("/");
    }
    next();
}

// Middleware to get user info and attach to request
async function attachUserInfo(req, res, next) {
    if (req.session.usersId) {
        try {
            const results = await db.getUserInfo(req.session.usersId);
            if (results.rows.length > 0) {
                req.user = results.rows[0];
            }
        } catch (error) {
            console.error("Error fetching user info:", error);
        }
    }
    next();
}

module.exports = {
    requireAuth,
    requireGuest,
    attachUserInfo
};
