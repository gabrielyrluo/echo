const mongoose = require("mongoose");

const groupMessageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    channel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Channel",
    },
  },
  {
    timestamps: true,
  }
);

const GroupMessage = mongoose.model("GroupMessage", groupMessageModel);

module.exports = GroupMessage;
