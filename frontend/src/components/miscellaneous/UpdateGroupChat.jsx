import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ChatState } from "@/context/ChatProvider";
import { useToast } from "@/hooks/use-toast";
import { Cog } from "lucide-react";
import { useState } from "react";
import UserBadge from "./UserBadge";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import UserListing from "./UserListing";
import axios from "axios";

const UpdateGroupChat = ({ fetchAgain, setFetchAgain, fetchMessages }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [renameLoading, setRenameLoading] = useState(false);

  const { user, selectedChat, setSelectedChat } = ChatState();
  const { toast } = useToast();

  const handleRemove = async (user1) => {
    if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
      toast({
        title: "Only Admins can Remove users",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupremove",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      user1._id === user._id ? setSelectedChat() : setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      fetchMessages();
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
    }
    setLoading(false);
  };

  const handleAddUser = async (user1) => {
    if (selectedChat.users.find((u) => u._id === user1._id)) {
      toast({
        title: "User is ALready in Group",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    if (selectedChat.groupAdmin._id !== user._id) {
      toast({
        title: "Only Admins can Add users",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/groupadd",
        {
          chatId: selectedChat._id,
          userId: user1._id,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
    }
    setLoading(false);
  };

  const handleRename = async () => {
    if (!groupChatName) {
      toast({
        title: "Pleasse Fill all the Fields!",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }

    try {
      setRenameLoading(true);
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.put(
        "/api/chat/rename",
        {
          chatId: selectedChat._id,
          chatName: groupChatName,
        },
        config
      );

      setSelectedChat(data);
      setFetchAgain(!fetchAgain);
      setRenameLoading(false);
    } catch (error) {
      toast({
        title: "Error Occurred",
        description: error.response.data.message,
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      setRenameLoading(false);
    }
    setGroupChatName("");
  };
  const handleSearch = async (query) => {
    setSearch(query);

    if (!query) {
      return toast({
        title: "Enter username",
        description: "Failed to Load the Chats",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`/api/user?search=${query}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Load the Search Results",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      setLoading(false);
    }
  };

  return (
    <div>
      <Dialog>
        <DialogTrigger>
          <Cog className="flex" />
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-[35px] flex justify-center font-sans">
              {selectedChat.chatName}
            </DialogTitle>
            <DialogDescription>
              <div className=" w-full flex flex-wrap pb-3">
                {selectedChat.users.map((u) => (
                  <UserBadge
                    key={u._id}
                    user={u}
                    handleFunction={() => handleRemove(u)}
                  />
                ))}
              </div>
              <form action="" className="flex">
                <Input
                  className="mb-3"
                  placeholder="Chat Name"
                  value={groupChatName}
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                <Button
                  variant="outline"
                  className="ml-1  "
                  disabled={renameLoading}
                  onClick={handleRename}
                >
                  Update
                </Button>
              </form>
              <form className="w-full">
                <Input
                  placeholder="Add Users eg:John, Jane"
                  className="mb-3"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                {loading ? (
                  <span>loading</span>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListing
                        key={user._id}
                        user={user}
                        handleFunction={() => handleAddUser(user)}
                      />
                    ))
                )}
                <Button variant="Blue" className="w-full" type="submit">
                  Leave Group
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UpdateGroupChat;
