const asyncHandler = require("express-async-handler");
const SingleChat = require("../models/signleChatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("UserId param not sent with request");
    return res.sendStatus(400);
  }

  try {
    // Check if the chat already exists between the two users
    var isChat = await SingleChat.findOne({
      users: { $all: [req.user._id, userId] },
    })
      .populate("users", "-password")
      .populate("latestMessage");

    // Populate the latestMessage sender details
    isChat = await User.populate(isChat, {
      path: "latestMessage.sender",
      select: "name pic email",
    });

    // If chat exists, return it
    if (isChat) {
      res.send(isChat);
    } else {
      // Create a new chat if it doesn't exist
      var chatData = {
        chatName: "sender",
        users: [req.user._id, userId],
      };

      const createdChat = await SingleChat.create(chatData);

      // Populate the users field in the newly created chat
      const FullChat = await SingleChat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password");

      res.status(200).json(FullChat);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

const fetchSingleChats = asyncHandler(async (req, res) => {
  try {
    SingleChat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

module.exports = {
  accessChat,
  fetchSingleChats,
};
