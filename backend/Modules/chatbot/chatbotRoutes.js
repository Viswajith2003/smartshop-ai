const express = require("express");
const router = express.Router();
const { processChatMessage } = require("./chatbotController");
const { protect } = require("../../middlewares/auth");

router.post("/message", protect, processChatMessage);

module.exports = router;
