import {
  Avatar,
  Box,
  Button,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  VStack,
  Container,
  Flex,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import React from "react";
import { ChatState } from "../Context/chatProvider";
import ProfileModel from "../components/miscellaneous/ProfileModel";
import { useHistory } from "react-router-dom";

const Mpage = () => {
  const { user, setUser } = ChatState();
  const history = useHistory();

  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem("userInfo");
    history.push("/");
  };

  const PCHandler = () => {
    // Navigate to the private chat page
    history.push("/privatechat");
  };

  const GCHandler = () => {
    // Navigate to the group chat page
    history.push("/groupchat");
  };

  return (
    <>
      <div style={{ width: "100%" }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          bg="white"
          w="100%"
          p="5px 10px 5px 10px"
          borderWidth="5px"
        >
          <Text fontSize={"2xl"}>ECHO</Text>
          <div>
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
        <Flex height="90vh" width="100%" align="center" justify="center">
          <Container maxW="xl" centerContent>
            <Box bg="white" w="100%" p={4} borderRadius="lg" borderWidth="1px">
              <VStack spacing="10px">
                <Button
                  colorScheme="red"
                  width="100%"
                  size={"lg"}
                  style={{ marginTop: 15 }}
                  onClick={PCHandler}
                >
                  Private Chat
                </Button>
                <Button
                  colorScheme="red"
                  width="100%"
                  size={"lg"}
                  style={{ marginTop: 15, marginBottom: 15 }}
                  onClick={GCHandler}
                >
                  Group Chat
                </Button>
              </VStack>
            </Box>
          </Container>
        </Flex>
      </div>
    </>
  );
};

export default Mpage;
