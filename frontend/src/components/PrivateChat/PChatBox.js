import React from "react";
import { ChatState } from "../../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import PSingleChat from "./PSingleChat";

const PChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  console.log(selectedChat);
  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={3}
      bg="white"
      w={{ base: "100%", md: "68%" }}
      // borderRadius="lg"
      borderWidth="1px"
    >
      <PSingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </Box>
  );
};

export default PChatBox;
