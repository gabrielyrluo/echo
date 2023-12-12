const asyncHandler = require("express-async-handler");
const GroupMessage = require("../models/groupMessageModel");
const User = require("../models/userModel");

const sendMessage = asyncHandler(async (req, res) => {
  const { content, channelId } = req.body;

  if (!content || !channelId) {
    console.log("Invalid data passed into request");
    return res.sendStatus(400);
  }

  var newMessage = {
    sender: req.user._id,
    content: content,
    channel: channelId,
  };

  try {
    var message = await GroupMessage.create(newMessage);
    message = await message.populate("sender", "name pic").execPopulate();
    message = await message.populate("channel").execPopulate();
    message = await User.populate(message, {
      path: "channel.users",
      select: "name pic email",
    });

    res.json(message);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const allMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await GroupMessage.find({ channel: req.params.channelId })
      .populate("sender", "name pic email")
      .populate("channel");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = { sendMessage, allMessages };
