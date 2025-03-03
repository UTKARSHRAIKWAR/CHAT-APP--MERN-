import { useEffect, useState } from "react";
import GroupModal from "./GroupModal";
import { Button } from "../ui/button";
import { MessageSquareDiff } from "lucide-react";
import { getSender } from "@/config/chatLogic";
import LoaderSkeliton from "../ui/LoaderSkeliton";
import { ChatState } from "@/context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const MyChats = ({ fetchAgain }) => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { toast } = useToast();

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    const storedChats = JSON.parse(localStorage.getItem("chats"));
    if (storedChats && storedChats.length > 0) {
      setChats(storedChats);
    } else {
      fetchChats(); // Fetch from API only if localStorage is empty
    }
  }, [fetchAgain]);

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("api/chat", config);
      // Ensure chats is always an array
      const chatsArray = Array.isArray(data) ? data : [data];

      setChats(chatsArray);
      localStorage.setItem("chats", JSON.stringify(chatsArray)); // Save to localStorage
      // setChats(data);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: "Failed to Load the Chats",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  return (
    <div className={` ${selectedChat ? "hidden" : "flex"} md:flex`}>
      <div className="flex flex-col items-start p-4 bg-white w-full sm:w-[90%] md:w-[40%] lg:w-[30%] xl:w-[25%] min-w-[300px] md:min-w-[350px] lg:min-w-[500px] rounded-lg shadow-lg">
        {/* Header Section */}
        <div className="flex justify-between items-center pb-4 px-4 w-full text-black font-extrabold text-[22px] sm:text-[24px] md:text-[26px] lg:text-[28px]">
          <span>My Chats</span>
          <GroupModal>
            <Button
              variant="ghost"
              size="lg"
              className="flex bg-[#F3F5F0] text-[15px] sm:text-[16px] md:text-[17px] lg:text-[18px] px-3 py-2"
            >
              <MessageSquareDiff className="w-5 h-5 md:w-6 md:h-6" />
              New Group Chat
            </Button>
          </GroupModal>
        </div>
        <div className="flex flex-col p-3 bg-[#F8F8F8] w-full h-full rounded-lg overflow-hidden">
          <div className="grid gap-4 overflow-y-scroll">
            {chats ? (
              chats.map((chat) => (
                <div
                  className={`flex items-center cursor-pointer px-3 py-2 rounded-lg hover:bg-gray-200 ${
                    selectedChat === chat
                      ? "bg-[#38B2AC] text-white"
                      : "bg-[#E8E8E8]"
                  }`}
                  onClick={() => setSelectedChat(chat)}
                  key={chat._id}
                >
                  <span className="text-lg font-medium">
                    {!chat.isGroupChat
                      ? getSender(loggedUser, chat.users)
                      : chat.chatName}
                  </span>
                </div>
              ))
            ) : (
              <LoaderSkeliton />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyChats;
