// Beer-related routes
const express = require("express");
const router = express.Router();
const db = require("../../utils/db");
const { requireAuth } = require("../middleware/auth");

// Get user's liked beers list
router.get("/beers_list", requireAuth, async (req, res) => {
    try {
        const results = await db.likedBeersList(req.session.usersId);
        res.json(results.rows);
    } catch (error) {
        console.error("Error fetching liked beers:", error);
        res.status(500).json({ error: "Failed to fetch beers list" });
    }
});

// Check if beer is liked by user
router.post("/search_liked_beer/:id", requireAuth, async (req, res) => {
    try {
        const beerId = req.params.id;
        const loggedUserId = req.session.usersId;
        
        const results = await db.searchLikedBeer(loggedUserId, beerId);
        
        if (results.rows.length === 0) {
            res.json({ status: 1 }); // Not liked
        } else {
            res.json({ status: 2 }); // Already liked
        }
    } catch (error) {
        console.error("Error checking liked beer:", error);
        res.status(500).json({ error: "Failed to check beer status" });
    }
});

// Like a beer
router.post("/like_beer/:id", requireAuth, async (req, res) => {
    try {
        const beerId = req.params.id;
        const userId = req.session.usersId;
        
        const results = await db.likeBeer(userId, beerId);
        
        if (results.rows.length > 0) {
            res.json({ success: true });
        } else {
            res.status(400).json({ success: false });
        }
    } catch (error) {
        console.error("Error liking beer:", error);
        res.status(500).json({ error: "Failed to like beer" });
    }
});

// Dislike a beer
router.post("/dislike_beer/:id", requireAuth, async (req, res) => {
    try {
        const beerId = req.params.id;
        const userId = req.session.usersId;
        
        await db.dislikeBeer(userId, beerId);
        res.json({ success: true });
    } catch (error) {
        console.error("Error disliking beer:", error);
        res.status(500).json({ error: "Failed to dislike beer" });
    }
});

// Get other user's profile and cellar
router.get("/otheruser/:id", requireAuth, async (req, res) => {
    try {
        const id = req.params.id;
        
        const results = await db.getUserAndCellar(id);
        
        if (results.rows.length === 0) {
            // User has no beers, get just user info
            const userResults = await db.getUserInfo(id);
            res.json(userResults.rows);
        } else {
            res.json(results.rows);
        }
    } catch (error) {
        console.error("Error fetching other user info:", error);
        res.status(500).json({ error: "Failed to fetch user info" });
    }
});

// Search users
router.get("/users/:val", requireAuth, async (req, res) => {
    try {
        const val = req.params.val;
        
        if (!val) {
            return res.redirect("/users/recent");
        }
        
        const results = await db.userSearch(val);
        
        if (results.rows.length === 0) {
            res.json({ error: 2 });
        } else {
            res.json(results.rows);
        }
    } catch (error) {
        console.error("Error searching users:", error);
        res.status(500).json({ error: "User search failed" });
    }
});

module.exports = router;
