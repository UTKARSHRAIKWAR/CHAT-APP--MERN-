import ChatBox from "@/components/ui/miscellaneous/ChatBox";
import MyChats from "@/components/ui/miscellaneous/MyChats";
import SideDrawer from "@/components/ui/miscellaneous/SideDrawer";
import { ChatState } from "@/context/ChatProvider";

const ChatPage = () => {
  const { user } = ChatState();

  return (
    <div className="w-full ">
      {user && <SideDrawer />}
      <div className="flex justify-between w-full p-10 h-90.5vh">
        {user && <MyChats />}
        {user && <ChatBox />}
      </div>
    </div>
  );
};

export default ChatPage;
