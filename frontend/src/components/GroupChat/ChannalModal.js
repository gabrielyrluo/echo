import { useDisclosure } from "@chakra-ui/react";
import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  Input,
  Box,
  ModalFooter,
  Button,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/chatProvider";
import axios from "axios";
import { useToast } from "@chakra-ui/react";

const ChannelModal = ({ children }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [channelName, setChannelName] = useState();
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const { user, chats, setChats, channels, setChannels, selectedChat } =
    ChatState();

  const handleSubmit = async () => {
    if (!channelName) {
      toast({
        title: "Please fill all the feilds",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top",
      });
      return;
    }

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      console.log(selectedChat);
      const { data } = await axios.post(
        `/api/channel/create`,
        {
          channelName: channelName,
          groupId: selectedChat._id,
          users: JSON.stringify(selectedChat.users.map((u) => u._id)),
          // users: JSON.stringify(selectedUsers.map((u) => u._id)),
        },
        config
      );

      setChannels([data, ...channels]);
      onClose();
      toast({
        title: "New Group and defalut channel Created!",
        status: "success",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    } catch (error) {
      toast({
        title: "Failed to Create the Chat!",
        description: "error",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom",
      });
    }
  };

  return (
    <>
      <span onClick={onOpen}>{children}</span>

      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader
            fontSize="35px"
            fontFamily="Work sans"
            display="flex"
            justifyContent="center"
          >
            Create New Channel
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody display="flex" flexDir="column" alignItems="center">
            <FormControl>
              <Input
                placeholder="Channel Name"
                mb={3}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleSubmit} colorScheme="blue">
              Create Channel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ChannelModal;
