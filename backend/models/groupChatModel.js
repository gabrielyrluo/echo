const mongoose = require("mongoose");

const groupChatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    groupAdmin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const GroupChat = mongoose.model("GroupChat", groupChatModel);

module.exports = GroupChat;
