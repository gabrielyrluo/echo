import { ChatState } from "../Context/chatProvider";
import { Box } from "@chakra-ui/react";
import SideDrawer from "../components/PrivateChat/SideDrawer";
import React, { useState } from "react";
import PChats from "../components/PrivateChat/PChats";
import PChatBox from "../components/PrivateChat/PChatBox";

const PGpage = () => {
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
        {user && <PChats fetchAgain={fetchAgain} />}
        {user && (
          <PChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </Box>
    </div>
  );
};

export default PGpage;
