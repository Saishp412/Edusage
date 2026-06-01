const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { askQuestion } = require("../controllers/query.controller");

router.post("/", auth, askQuestion);
router.post("/:notebookId", auth, askQuestion);

module.exports = router;
