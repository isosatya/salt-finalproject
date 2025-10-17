// File upload routes
const express = require("express");
const router = express.Router();
const db = require("../../utils/db");
const s3 = require("../../s3");
const { requireAuth } = require("../middleware/auth");
const CONFIG = require("../config/constants");

// Configure multer for file uploads
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, CONFIG.UPLOAD_DIR);
    },
    filename: function(req, file, callback) {
        uidSafe(24).then(function(uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    }
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: CONFIG.MAX_FILE_SIZE
    }
});

// Upload profile picture
router.post("/upload", requireAuth, uploader.single("file"), s3.upload, async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No file uploaded" });
        }

        const url = CONFIG.S3_URL_PREFIX + req.file.filename;
        const userId = req.session.usersId;

        // Update profile picture in users table
        await db.updateProfilePic(userId, url);
        
        // Add pic to database for later deletion
        await db.addPicDatabase(userId, url);
        
        res.json(url);
    } catch (error) {
        console.error("Upload error:", error);
        res.status(500).json({ error: "Upload failed" });
    }
});

// Delete user account and all associated data
router.get("/delete", requireAuth, async (req, res) => {
    try {
        const userId = req.session.usersId;

        // Get user's pictures for S3 deletion
        const picsResults = await db.getPicsUserDatabase(userId);
        const images = picsResults.rows.map(image => image.imgurl.slice(39));
        
        // Delete from S3
        s3.delete(images);
        
        // Delete from database in correct order
        await db.deletePicsUserDatabase(userId);
        await db.deleteUserFriendships(userId);
        await db.deleteUser(userId);
        
        req.session = null;
        res.redirect("/");
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Failed to delete account" });
    }
});

module.exports = router;
