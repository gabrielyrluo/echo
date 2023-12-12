import React, { useState } from "react";
import SideDrawer from "../components/GroupChat/SideDrawer";
import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import Channels from "../components/GroupChat/Channels";
import ChannelBox from "../components/GroupChat/ChannelBox";

const CGpage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState(false);
  return (
    <div style={{ width: "100%" }}>
      {user && <SideDrawer />}
      <Box
        display={"flex"}
        // justifyContent={"space-between"}
        w={"100%"}
        h={"91.5vh"}
        p={"10px"}
      >
        {user && <Channels fetchAgain={fetchAgain} />}
        {user && (
          <ChannelBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default CGpage;
