const express = require("express");
const router = express.Router();
const studioController = require("../controllers/studio.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Apply authentication middleware to all routes
router.use(authMiddleware);

// Unified Studio Generation Endpoint
router.post("/generate", studioController.generateContent);

module.exports = router;
