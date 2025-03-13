import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ChatState } from "@/context/ChatProvider";
import axios from "axios";
import UserListing from "./UserListing";
import UserBadge from "./UserBadge";

const GroupModal = ({ children }) => {
  const [groupChatName, setGroupChatName] = useState();
  const [selectedUser, setSelectedUser] = useState([]);
  const [search, setSearch] = useState();
  const [searchResult, setSearchResult] = useState();
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const { user, chats, setChats } = ChatState();

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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

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
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!groupChatName || !selectedUser) {
      toast({
        title: "Pleasse Fill all the Fields!",
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

      const { data } = await axios.post(
        "/api/chat/group",
        {
          name: groupChatName,
          users: JSON.stringify(selectedUser.map((u) => u._id)),
        },
        config
      );

      setChats([data, ...chats]);

      toast({
        title: "New Group Chat Created!",
        status: "Success",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to Create Group Chat",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleGroup = (userToAdd) => {
    if (selectedUser.includes(userToAdd)) {
      toast({
        title: "User Already Added!",
        status: "error",
        variant: "destructive",
        duration: 3000,
      });
      return;
    }
    setSelectedUser([...selectedUser, userToAdd]);
  };

  const handleDelete = (del) => {
    setSelectedUser(
      selectedUser.filter((selected) => selected._id !== del._id)
    );
  };

  return (
    <div className="gap-3 ">
      <Dialog>
        <DialogTrigger>{children}</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex justify-center text-[30px] font-sans">
              Create Group Chat
            </DialogTitle>
            <DialogDescription className="flex flex-col items-center">
              <form onSubmit={handleSubmit} className="w-full">
                <Input
                  placeholder="Chat Name"
                  className="mb-4"
                  onChange={(e) => setGroupChatName(e.target.value)}
                />
                {""}
                <Input
                  placeholder="Add Users eg:John, Jane"
                  className="mb-3"
                  onChange={(e) => handleSearch(e.target.value)}
                />
                <div className="w-full flex flex-wrap">
                  {selectedUser.map((user) => (
                    <UserBadge
                      key={user._id}
                      user={user}
                      handleFunction={() => handleDelete(user)}
                    />
                  ))}
                </div>

                {loading ? (
                  <span>loading</span>
                ) : (
                  searchResult
                    ?.slice(0, 4)
                    .map((user) => (
                      <UserListing
                        key={user._id}
                        user={user}
                        handleFunction={() => handleGroup(user)}
                      />
                    ))
                )}

                <Button variant="Blue" className="w-full" type="submit">
                  Create Chat
                </Button>
              </form>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupModal;
