const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const topicDocumentController = require("../controllers/topicDocument.controller");
const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: async (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    try {
      await fs.mkdir(uploadPath, { recursive: true });
      cb(null, uploadPath);
    } catch (error) {
      cb(error);
    }
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ 
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  }
});

// Upload PDF with topic-based chunking
router.post("/upload-topic", auth, upload.single("pdf"), topicDocumentController.uploadWithTopicChunking);

// Get topic statistics for a document
router.get("/:notebookId/topics", auth, topicDocumentController.getDocumentTopics);

// Compare chunking methods
router.get("/:notebookId/compare", auth, topicDocumentController.compareChunkingMethods);

module.exports = router;
