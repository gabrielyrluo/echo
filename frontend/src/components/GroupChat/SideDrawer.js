import {
  Avatar,
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
  useDisclosure,
  useToast,
  Badge,
} from "@chakra-ui/react";
import { ChatIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/chatProvider";
import ProfileModel from "../miscellaneous/ProfileModel";
import { useHistory } from "react-router-dom";
import axios from "axios";
import ChatList from "./ChatList";
import { getSender } from "../../config/Chatlogic";
import GroupChatModal from "./GroupChatModal";

const SideDrawer = () => {
  const {
    user,
    setUser,
    setSelectedChat,
    chats,
    setChats,
    notification,
    setNotification,
  } = ChatState();
  const history = useHistory();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const logoutHandler = () => {
    setUser(null);
    setSelectedChat(null);
    setChats([]);
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/groupchat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occured!",
        description: "Failed to Load the chats",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const accessChat = async (chatId) => {
    try {
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("/api/groupchat", { chatId }, config);

      setSelectedChat(data);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  const clearNotifis = () => {
    setNotification([]);
  };

  return (
    <>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
      >
        <Tooltip label="See All Chats" hasArrow placement="bottom-end">
          <Button
            variant={"ghost"}
            onClick={() => {
              onOpen();
              fetchChats();
            }}
          >
            <i class="fas fa-search"></i>
            <Text display={{ base: "none", md: "flex" }} px={"4"}>
              My Group Chats
            </Text>
          </Button>
        </Tooltip>
        <Text fontSize={"2xl"}>ECHO</Text>
        <div>
          {/* <Menu>
            <MenuButton p={1}>
              {notification.length >= 1 && (
                <Badge colorScheme="red" fontSize="0.8em">
                  {notification.length}
                </Badge>
              )}
              <ChatIcon fontSize={"2xl"} m={1} />
            </MenuButton>
            <MenuList pl={2}>
              {!notification.length && "No New Messages"}
              {notification.map((notif) => (
                <MenuItem
                  key={notif._id}
                  onClick={() => {
                    setSelectedChat(notif.chat);
                    // console.log(notif.chat._id, notification);
                    setNotification(
                      notification.filter((n) => n.chat._id !== notif.chat._id)
                    );
                  }}
                >
                  {notif.chat.isGroupChat
                    ? `New Message in ${notif.chat.chatName}`
                    : `New Message from ${getSender(user, notif.chat.users)}`}
                </MenuItem>
              ))}
              {notification.length > 0 && (
                <Button colorScheme={"red"} onClick={clearNotifis}>
                  Clear
                </Button>
              )}
            </MenuList>
          </Menu> */}
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
              <Avatar
                size={"sm"}
                cursor={"pointer"}
                name={user.name}
                src={user.pic}
              />
            </MenuButton>
            <MenuList>
              <ProfileModel user={user}>
                <MenuItem>My Profile</MenuItem>
              </ProfileModel>

              <MenuItem onClick={logoutHandler}>Logout</MenuItem>
            </MenuList>
          </Menu>
        </div>
      </Box>

      <Drawer placement={"left"} onClose={onClose} isOpen={isOpen}>
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader borderBottomWidth={"1px"}>My Group Chats</DrawerHeader>
          <GroupChatModal>
            <Button width={"100%"} alignSelf={"center"} color={"red"}>
              Create New Group
            </Button>
          </GroupChatModal>
          <DrawerBody>
            {chats?.map((chat) => (
              <ChatList
                key={chat._id}
                chat={chat}
                handleFunction={() => accessChat(chat._id)}
              />
            ))}
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </>
  );
};

export default SideDrawer;
