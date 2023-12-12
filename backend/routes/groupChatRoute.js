const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  accessChat,
  fetchChats,
  createChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  resignGroupAdmin,
} = require("../controllers/groupChatController");

const router = express.Router();

router.route("/").post(protect, accessChat);
router.route("/").get(protect, fetchChats);
router.route("/create").post(protect, createChat);
router.route("/rename").put(protect, renameGroup);
router.route("/remove").put(protect, removeFromGroup);
router.route("/add").put(protect, addToGroup);
router.route("/resigngroupadmin").put(protect, resignGroupAdmin);

module.exports = router;
