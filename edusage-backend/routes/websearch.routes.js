const express = require("express");
const router = express.Router();
const webSearchController = require("../controllers/websearch.controller");
const authMiddleware = require("../middlewares/auth.middleware");

// Perform web search
router.post("/", authMiddleware, webSearchController.webSearch);

// Get search provider status
router.get("/status", authMiddleware, webSearchController.getSearchStatus);

// Add a web source to a notebook
router.post("/:notebookId/sources", authMiddleware, webSearchController.addWebSource);

// Get web sources for a notebook
router.get("/:notebookId/sources", authMiddleware, webSearchController.getWebSources);

// Delete a web source
router.delete("/sources/:sourceId", authMiddleware, webSearchController.deleteWebSource);

// Alternative endpoint for SerpApi (if configured)
router.post("/serpapi", authMiddleware, webSearchController.webSearchSerpApi);

module.exports = router;
