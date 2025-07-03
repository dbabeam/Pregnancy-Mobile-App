// messagesRoutes.js
const express = require("express");
const router = express.Router();
const messageController = require("../controllers/messagesController");

router.get("/:userId", messageController.getUserMessages);
router.post("/", messageController.sendMessage); // 🔥 New route to send messages

module.exports = router;
