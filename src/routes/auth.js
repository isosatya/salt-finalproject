// Authentication routes
const express = require("express");
const router = express.Router();
const db = require("../../utils/db");
const bc = require("../../utils/bc");
const { requireAuth, requireGuest } = require("../middleware/auth");

// Registration route
router.post("/register", requireGuest, async (req, res) => {
    try {
        const { username, age, city, email, password } = req.body;

        // Basic validation
        if (!username || !age || !city || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        // Hash password
        const hash = await bc.hashPassword(password);
        
        // Add user to database
        const results = await db.addUsers(username, age, city, email, hash);
        
        // Set session
        req.session.usersId = results.rows[0].id;
        
        res.json({ userId: results.rows[0].id });
    } catch (error) {
        if (error.code === 23505) {
            res.status(400).json({ error: "Email already exists" });
        } else {
            console.error("Registration error:", error);
            res.status(500).json({ error: "Registration failed" });
        }
    }
});

// Login route
router.post("/login", requireGuest, async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: "Email and password are required" });
        }

        // Get user from database
        const match = await db.login(email);
        
        if (match.rows.length === 0) {
            return res.status(401).json({ error: "Email not found" });
        }

        // Check password
        const doesMatch = await bc.checkPassword(password, match.rows[0].password);
        
        if (doesMatch) {
            req.session.usersId = match.rows[0].id;
            res.json({ userId: match.rows[0].id });
        } else {
            res.status(401).json({ error: "Password incorrect" });
        }
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Login failed" });
    }
});

// Logout route
router.get("/logout", requireAuth, (req, res) => {
    req.session = null;
    res.redirect("/");
});

// Get current user info
router.get("/user", requireAuth, async (req, res) => {
    try {
        const results = await db.getUserInfo(req.session.usersId);
        res.json(results.rows);
    } catch (error) {
        console.error("Error fetching user info:", error);
        res.status(500).json({ error: "Failed to fetch user info" });
    }
});

module.exports = router;
