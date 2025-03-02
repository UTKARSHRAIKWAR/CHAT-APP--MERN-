import ChatBox from "@/components/miscellaneous/ChatBox";
import MyChats from "@/components/miscellaneous/MyChats";
import SideDrawer from "@/components/miscellaneous/SideDrawer";
import { ChatState } from "@/context/ChatProvider";
import { useState } from "react";

const ChatPage = () => {
  const { user } = ChatState();
  const [fetchAgain, setFetchAgain] = useState();

  return (
    <div className="w-full ">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full p-10 h-[90.5vh] gap-6">
        {user && <MyChats fetchAgain={fetchAgain} />}
        {user && (
          <ChatBox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        )}
      </div>
    </div>
  );
};

export default ChatPage;
