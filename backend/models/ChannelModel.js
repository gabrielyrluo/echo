const mongoose = require("mongoose");

const channelModel = mongoose.Schema(
  {
    channelName: { type: String, trim: true },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "GroupChat" },
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

const Channel = mongoose.model("Channel", channelModel);

module.exports = Channel;
