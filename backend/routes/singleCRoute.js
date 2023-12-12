const express = require("express");
const {
  accessChat,
  fetchSingleChats,
} = require("../controllers/singleChatController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchSingleChats);

module.exports = router;
