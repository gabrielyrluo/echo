const mongoose = require("mongoose");

const singleChatModel = mongoose.Schema(
  {
    chatName: { type: String, trim: true },
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    latestMessage: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SingleMessage",
    },
  },
  {
    timestamps: true,
  }
);

const SingleChat = mongoose.model("SingleChat", singleChatModel);

module.exports = SingleChat;
