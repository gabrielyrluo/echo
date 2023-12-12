const mongoose = require("mongoose");

const singleMessageModel = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    content: { type: String, trim: true },
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SingleChat",
    },
  },
  {
    timestamps: true,
  }
);

const SingleMessage = mongoose.model("SingleMessage", singleMessageModel);

module.exports = SingleMessage;
