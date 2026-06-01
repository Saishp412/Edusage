const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const {
  createNotebook,
  getNotebooks,
  deleteNotebook
} = require("../controllers/notebook.controller");

router.post("/", auth, createNotebook);
router.get("/", auth, getNotebooks);

// FIXED: param name matches controller
router.delete("/:notebookId", auth, deleteNotebook);

module.exports = router;
