const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  createChannel,
  accessChannels,
  intoChannel,
  removeChannel,
} = require("../controllers/channelController");

const router = express.Router();

router.route("/").post(protect, accessChannels);
router.route("/").post(protect, intoChannel);
router.route("/create").post(protect, createChannel);
router.route("/remove").delete(protect, removeChannel);
// router.route("/add").put(protect, addToGroup);
// router.route("/resigngroupadmin").put(protect, resignGroupAdmin);

module.exports = router;
