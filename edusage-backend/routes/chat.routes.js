const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const testChatController = require("../controllers/test-chat.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Get chat history for a notebook
router.get("/:notebookId", authMiddleware, chatController.getChatHistory);

// Save a chat message via API
router.post("/:notebookId", authMiddleware, chatController.saveChatMessageAPI);

// Clear chat history for a notebook
router.delete("/:notebookId", authMiddleware, chatController.clearChatHistory);

// Test chat functionality
router.get("/test/chat", authMiddleware, testChatController.testChat);

module.exports = router;
