const Channel = require("../models/ChannelModel"); // Ensure this is correctly imported
const asyncHandler = require("express-async-handler");
const GroupChat = require("../models/groupChatModel");
const User = require("../models/userModel");

const createChannel = asyncHandler(async (req, res) => {
  const { channelName, groupId } = req.body;

  // Validate the input
  if (!channelName || !groupId) {
    return res
      .status(400)
      .send({ message: "Channel name and group ID are required" });
  }

  try {
    const existingChannel = await Channel.findOne({
      channelName: channelName,
      groupId: groupId,
    });
    if (existingChannel) {
      return res.status(409).send({
        message: "A channel with this name already exists in the group",
      });
    }

    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
      return res
        .status(400)
        .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);
    // Create the channel
    const channel = await Channel.create({
      channelName: channelName,
      groupId: groupId,
      users: users,
      groupAdmin: req.user._id, // Assuming req.user is populated with the user's data
    });

    // Populate necessary fields if required
    const fullChannel = await Channel.findById(channel._id).populate(
      "groupAdmin",
      "-password"
    ); // Example of populating the group admin

    res.status(200).json(fullChannel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const accessChannels = asyncHandler(async (req, res) => {
  const { groupId } = req.body;

  if (!groupId) {
    return res.status(400).send({ message: "Group ID is required" });
  }

  try {
    // Find all channels associated with the groupId
    const channels = await Channel.find({ groupId: groupId }).populate(
      "groupAdmin",
      "-password"
    );

    if (channels.length === 0) {
      return res
        .status(404)
        .send({ message: "No channels found for this group" });
    }

    res.status(200).json(channels);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const intoChannel = asyncHandler(async (req, res) => {
  const { channelName, groupId } = req.body;

  if (!channelName || !groupId) {
    return res
      .status(400)
      .send({ message: "Channel name and group ID are required" });
  }

  try {
    // Find the channel that matches the channelName and groupId
    const channel = await Channel.findOne({
      channelName: channelName,
      groupId: groupId,
    }).populate("groupAdmin", "-password"); // Populate groupAdmin if necessary, adjust as needed

    if (!channel) {
      return res.status(404).send({ message: "Channel not found" });
    }

    res.status(200).json(channel);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const removeChannel = asyncHandler(async (req, res) => {
  const { channelName, groupId } = req.body;

  if (!channelName || !groupId) {
    return res
      .status(400)
      .send({ message: "Channel name and group ID are required" });
  }

  try {
    // Find the channel by channelName and groupId
    const channel = await Channel.findOneAndDelete({
      channelName: channelName,
      groupId: groupId,
    });

    if (!channel) {
      return res
        .status(404)
        .send({ message: "Channel not found or already removed" });
    } else {
      const channels = await Channel.find({ groupId: groupId }).populate(
        "groupAdmin",
        "-password"
      );

      if (channels.length === 0) {
        return res
          .status(404)
          .send({ message: "No channels found for this group" });
      }

      res.status(200).json(channels);
    }
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

const resignChannelAdmin = async (groupId, newAdminId) => {
  try {
    // Find channels associated with the groupId and where the old admin is the current admin
    const channels = await Channel.find({
      groupId: groupId,
    });

    // Update the admin for each channel
    const updatePromises = channels.map((channel) => {
      return Channel.findByIdAndUpdate(
        channel._id,
        { groupAdmin: newAdminId },
        { new: true }
      );
    });

    await Promise.all(updatePromises);
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = {
  createChannel,
  accessChannels,
  intoChannel,
  removeChannel,
  resignChannelAdmin,
};
