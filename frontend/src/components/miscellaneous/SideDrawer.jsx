import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader, Search } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatState } from "@/context/ChatProvider";
import ProfileDialog from "../dailogs/ProfileDialog";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import LoaderSkeliton from "../ui/LoaderSkeliton";
import UserListing from "./UserListing";

const SideDrawer = ({ onclose }) => {
  const { user, setSelectedChat, chats, setChats } = ChatState();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingChat, setLoadingChat] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // Load chats from localStorage on mount
    const storedChats = JSON.parse(localStorage.getItem("chats"));
    if (storedChats) setChats(storedChats);
  }, []);

  const logOutHandler = () => {
    localStorage.removeItem("userInfo");
    localStorage.removeItem("chats"); // Clear stored chats on logout
    navigate("/");
  };

  const handleSearch = async () => {
    if (!search) {
      toast({
        title: "Please Enter something in search",
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

      const { data } = await axios.get(`/api/user?search=${search}`, config);

      setLoading(false);
      setSearchResult(data);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: "Failed to Load the Search Results",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const accessChat = async (userId) => {
    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.post("api/chat", { userId }, config);

      let updatedChats = chats;
      if (!chats.find((c) => c._id === data._id)) {
        updatedChats = [data, ...chats];
        setChats(updatedChats);
        localStorage.setItem("chats", JSON.stringify(updatedChats)); // Store in localStorage
      }

      // if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);

      setSelectedChat(data);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    } finally {
      setLoadingChat(false);
      onclose?.();
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md flex justify-between">
      <div>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <Search size={20} />
                    <span>Search user</span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left">
                  <SheetHeader>
                    <SheetTitle>Find Users</SheetTitle>
                    <SheetDescription>
                      Search and chat with users instantly.
                    </SheetDescription>
                  </SheetHeader>
                  <div className="flex justify-between pb-2  ">
                    <Input
                      value={search}
                      type="text"
                      placeholder="Search users to Chat"
                      className="w-[280px]"
                      onChange={(e) => {
                        setSearch(e.target.value);
                      }}
                    />
                    <Button
                      type="submit"
                      onClick={handleSearch}
                      size={15}
                      variant="ghost"
                    >
                      <Search /> Go
                    </Button>
                  </div>
                  <div>
                    {loading ? (
                      <LoaderSkeliton />
                    ) : (
                      searchResult?.map((user) => (
                        <UserListing
                          key={user._id}
                          user={user}
                          handleFunction={() => accessChat(user._id)}
                        />
                      ))
                    )}
                    {loadingChat && (
                      <Loader
                        className="animate-spin text-blue-500 flex"
                        size={32}
                      />
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </TooltipTrigger>
            <TooltipContent>
              <p>Search user to Chat</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      <div className="">
        <Menubar asChild>
          <MenubarMenu>
            <MenubarTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src={user.pic} />
                <AvatarFallback>{user.name}</AvatarFallback>
              </Avatar>
            </MenubarTrigger>
            <MenubarContent>
              <ProfileDialog > 
                <MenubarItem>
                  My Profile
                  <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
              </ProfileDialog>

              <MenubarSeparator />
              <MenubarItem onClick={logOutHandler}>Logout</MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      </div>
    </div>
  );
};

export default SideDrawer;
