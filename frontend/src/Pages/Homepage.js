import React from "react";
import {
  Container,
  Box,
  Text,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
} from "@chakra-ui/react";

import Login from "../components/Authentication/login";
import Signup from "../components/Authentication/signup";
import { useHistory } from "react-router-dom";
import { useEffect } from "react";

const Homepage = () => {
  const history = useHistory();

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("userInfo"));

    if (user) history.push("/chats");
  }, [history]);

  return (
    <Container maxw="xl" centerContent>
      <Box
        d="flex"
        justifyContent={"center"}
        p={3}
        bg={"white"}
        w="100%"
        m="40px 0 15px 0"
        borderRadius={"lg"}
        borderWidth={"1px"}
      >
        <Text
          fontSize="4xl"
          fontFamily={"Work Sans"}
          color={"black"}
          align={"center"}
        >
          Mybihal
        </Text>
        <Tabs size="md" variant="enclosed">
          <TabList>
            <Tab width={"50%"}>LOGIN</Tab>
            <Tab width={"50%"}>SIGN UP</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Login />
            </TabPanel>
            <TabPanel>
              <Signup />
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </Container>
  );
};

export default Homepage;
