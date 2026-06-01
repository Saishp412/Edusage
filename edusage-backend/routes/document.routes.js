const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const upload = require("../middlewares/upload.middleware");
const {
  uploadDocument,
  uploadDocuments,
  getDocumentsForNotebook,
  getAllDocumentsForUser,
  getDiagramsForNotebook,
} = require("../controllers/document.controller");

router.get("/", auth, getAllDocumentsForUser);
router.get("/:notebookId", auth, getDocumentsForNotebook);
router.get("/notebook/:notebookId/diagrams", auth, getDiagramsForNotebook);

// Single file upload (backward compatible)
router.post(
  "/:notebookId",
  auth,
  upload.single("file"),
  uploadDocument
);

// Multiple files upload
router.post(
  "/:notebookId/batch",
  auth,
  upload.array("files", 10),
  uploadDocuments
);

module.exports = router;
