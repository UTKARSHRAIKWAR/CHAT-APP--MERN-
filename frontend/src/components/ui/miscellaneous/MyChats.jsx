import { ChatState } from "@/context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import { useEffect, useState } from "react";

const MyChats = () => {
  const [loggedUser, setLoggedUser] = useState();
  const { user, selectedChat, setSelectedChat, chats, setChats } = ChatState();
  const { toast } = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("api/chat", config);
      setChats(data);
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

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, []);

  return (
    <div className={` ${selectedChat ? "hidden" : "flex"} md:flex`}>
      <div className="flex flex-col items-start p-5 bg-white w-full md:w-[30%] min-w-[250px] rounded-lg shadow-lg">
        <div className="pb-4 px-4 w-full text-black font-extrabold text-[28px] md:text-[30px]">
          My Chats
        </div>
      </div>
    </div>
  );
};

export default MyChats;
