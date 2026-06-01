const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth.middleware");
const { getActivity } = require("../controllers/activity.controller");

router.get("/", auth, getActivity);

module.exports = router;
