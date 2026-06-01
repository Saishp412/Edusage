const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const topicQueryController = require("../controllers/topicQuery.controller");

// Topic-aware query endpoint
router.post("/", auth, topicQueryController.processTopicAwareQuery);

// Fallback to original query system
router.post("/fallback", auth, topicQueryController.processFallbackQuery);

module.exports = router;
