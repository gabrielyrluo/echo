const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/groupMessageController");

const router = express.Router();

router.route("/").post(protect, sendMessage);
router.route("/:channelId").get(protect, allMessages);

module.exports = router;
