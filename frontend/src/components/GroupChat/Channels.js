import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box, useToast, Stack, Text, Button } from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import axios from "axios";
import ChatLoading from "../miscellaneous/ChatLoading";
import ChannelModal from "./ChannalModal";

const Channels = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const {
    selectedChat,
    setSelectedChat,
    user,
    chats,
    setChats,
    channels,
    setChannels,
    setSelectedChannel,
    selectedChannel,
  } = ChatState();
  const toast = useToast();

  const fetchChannels = async () => {
    if (!selectedChat) {
      return;
    }

    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post(
        "/api/channel",
        { groupId: selectedChat._id },
        config
      );
      console.log(data);
      setChannels(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the channels",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChannels();
  }, [selectedChat, fetchAgain]);

  return (
    <Box
      display={{ base: selectedChannel ? "none" : "flex", md: "flex" }}
      flexDir="column"
      alignItems="center"
      p={3}
      bg="white"
      w={{ base: "100%", md: "31%" }}
      // borderRadius="lg"
      borderWidth="1px"
    >
      <Box
        pb={3}
        px={3}
        fontSize={{ base: "28px", md: "30px" }}
        display="flex"
        w="100%"
        justifyContent="space-between"
        alignItems="center"
      >
        {selectedChat?.chatName}
        <ChannelModal>
          <Button
            display={selectedChat ? "flex" : "none"}
            fontSize={{ base: "17px", md: "10px", lg: "17px" }}
            rightIcon={<AddIcon />}
          >
            New Channel
          </Button>
        </ChannelModal>
      </Box>
      <Box
        display="flex"
        flexDir="column"
        p={3}
        bg="#F8F8F8"
        w="100%"
        h="100%"
        // borderRadius="lg"
        overflowY="hidden"
      >
        {channels ? (
          <Stack overflowY={"scroll"}>
            {channels.map((channel) => (
              <Box
                onClick={() => setSelectedChannel(channel)}
                cursor="pointer"
                bg={selectedChannel === channel ? "#38B2AC" : "#E8E8E8"}
                color={selectedChannel === channel ? "white" : "black"}
                px={3}
                py={2}
                // borderRadius="lg"
                key={channel._id}
              >
                <Text>{channel.channelName}</Text>
              </Box>
            ))}
          </Stack>
        ) : (
          <ChatLoading />
        )}
      </Box>
    </Box>
  );
};

export default Channels;
