const asyncHandler = require("express-async-handler");
const GroupChat = require("../models/groupChatModel");
const User = require("../models/userModel");
const { resignChannelAdmin } = require("./channelController");

const createChat = asyncHandler(async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill all the feilds" });
  }

  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send("More than 2 users are required to form a group chat");
  }

  users.push(req.user);

  try {
    const groupChat = await GroupChat.create({
      chatName: req.body.name,
      users: users,
      groupAdmin: req.user,
    });

    const fullGroupChat = await GroupChat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const fetchChats = asyncHandler(async (req, res) => {
  try {
    GroupChat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

const accessChat = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  if (!chatId) {
    return res.status(400).send({ message: "Chat ID is required" });
  }

  try {
    const chat = await GroupChat.findById(chatId)
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!chat) {
      res.status(404).send({ message: "Chat not found" });
    } else {
      res.status(200).json(chat);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await GroupChat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const removed = await GroupChat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  // check if the requester is admin

  const added = await GroupChat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

const resignGroupAdmin = asyncHandler(async (req, res) => {
  const { chatId } = req.body;

  // Fetch the chat document
  const chat = await GroupChat.findById(chatId)
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!chat) {
    res.status(404);
    throw new Error("Chat not found");
  }

  // Check if the current admin is still in the group
  if (!chat.users.some((user) => user._id.equals(chat.groupAdmin._id))) {
    // If the current admin is not in the group, reassign the admin role
    // to the first user in the users list
    const updatedChat = await GroupChat.findByIdAndUpdate(
      chatId,
      { groupAdmin: chat.users[0]._id },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    await resignChannelAdmin(chatId, chat.users[0]._id);

    res.status(200).json(updatedChat);
  } else {
    res.status(200).json(chat); // Send back the original chat if no changes are made
  }
});

module.exports = {
  createChat,
  fetchChats,
  accessChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
  resignGroupAdmin,
};
