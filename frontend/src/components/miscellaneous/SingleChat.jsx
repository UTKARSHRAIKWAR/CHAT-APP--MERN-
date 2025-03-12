import { ChatState } from "@/context/ChatProvider";
import { Button } from "../ui/button";
import { ArrowLeft, SendHorizontal, EllipsisVertical } from "lucide-react";
import { getSender, getSenderFull } from "@/config/chatLogic";
import ProfileDialogSelected from "../dailogs/SelectedProfileDialoge";
import UpdateGroupChat from "./UpdateGroupChat";
import { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { Input } from "../ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ScrollableChat from "./ScrollableChat";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { io } from "socket.io-client";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

const ENDPOINT = "http://localhost:5000";
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat, notification, setNotification } =
    ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [socketConnected, setSocketConnected] = useState(false);
  const { toast } = useToast();
  const [typing, setTyping] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // const defaultOptions = () => ({
  //   loop: true,
  //   autoplay: true,
  //   animationData: animationData,
  //   rendererSettings: {
  //     preserveAspectRatio: "xMidYMid slice",
  //   },
  // });

  const fetchMessages = async () => {
    if (!selectedChat) return;

    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };
      setLoading(true);
      const { data } = await axios.get(
        `api/message/${selectedChat._id}`,
        config
      );
      setMessages(data);

      setLoading(false);

      socket.emit("join chat", selectedChat._id);
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", user);
    socket.on("connected", () => setSocketConnected(true));
    socket.on("typing", () => setIsTyping(true));
    socket.on("stop typing", () => setIsTyping(false));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = selectedChat;
  }, [selectedChat]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived) => {
      if (
        !selectedChatCompare ||
        selectedChatCompare._id !== newMessageReceived.chat._id
      ) {
        //give notification
        if (!notification.includes(newMessageReceived)) {
          setNotification([newMessageReceived, ...notification]);
          setFetchAgain(!fetchAgain);
        }
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!newMessage.trim()) return;

    socket.emit("stop typing", selectedChat._id);
    try {
      const config = {
        headers: {
          "content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(
        "api/message",
        {
          content: newMessage,
          chatId: selectedChat._id,
        },
        config
      );

      setMessages([...messages, data]);
      socket.emit("new message", data);

      setNewMessage("");
    } catch (error) {
      toast({
        title: "Something Went Wrong!",
        description: error.message,
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);

    if (!socketConnected) return;

    if (!typing) {
      setTyping(true);
      socket.emit("typing", selectedChat._id);
    }

    let lastTypingTime = new Date().getTime();
    var timerLength = 3000;
    setTimeout(() => {
      var timeNow = new Date().getTime();
      var timeDiff = timeNow - lastTypingTime;

      if (timeDiff > timerLength && typing) {
        socket.emit("stop typing", selectedChat._id);
        setTyping(false);
      }
    }, timerLength);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <div className=" flex justify-between  items-center gap-2 pb-3 px-2 w-full font-sans text-[28px] md:text-[30px]">
            <div className="flex justify-start gap-2">
              {" "}
              <Button
                className="flex md:hidden"
                variant="ghost"
                size="icon"
                onClick={() => setSelectedChat(null)}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              {!selectedChat.isGroupChat ? (
                <>
                  <ProfileDialogSelected
                    user={getSenderFull(user, selectedChat.users)}
                  />
                  {getSender(user, selectedChat.users)}
                </>
              ) : (
                <>
                  {selectedChat.chatName.toUpperCase()}
                  <UpdateGroupChat
                    fetchAgain={fetchAgain}
                    setFetchAgain={setFetchAgain}
                    fetchMessages={fetchMessages}
                  />
                </>
              )}
            </div>
            <div>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <EllipsisVertical />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  {/* <DropdownMenuLabel>Clear Chat</DropdownMenuLabel> */}
                  {/* <DropdownMenuSeparator /> */}
                  <DropdownMenuItem>Clear Chat</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-y-hidden">
            {loading ? (
              <ColorRing
                visible={true}
                height="90"
                width="90"
                ariaLabel="color-ring-loading"
                wrapperStyle={{}}
                wrapperClass="color-ring-wrapper self-center m-auto"
                colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
              />
            ) : (
              <div className="flex flex-col overflow-y-scroll no-scrollbar">
                <ScrollableChat messages={messages} />
                {isTyping ? (
                  <>
                    <DotLottieReact
                      src="https://lottie.host/bcfbc45f-66b0-4780-aa4d-111528d62526/Epr9HIUzoj.lottie"
                      loop
                      autoplay
                      className="w-[80px] mt-2 mb-2 ml-2"
                    />
                  </>
                ) : (
                  <></>
                )}
              </div>
            )}
            <form onSubmit={sendMessage} className="flex gap-2 mt-3">
              <Input
                variant="filled"
                className="bg-[#E0E0E0]"
                onKeyDown={(e) => e.key === "Enter" && sendMessage(e)}
                onChange={typingHandler}
                placeholder="Enter a message..."
                value={newMessage || ""}
              />
              <Button
                variant="outline"
                type="submit"
                onClick={sendMessage}
                className="bg-[#CCCCCC] px-4 py-2 rounded-lg hover:bg-[#D6FDFF]"
              >
                <SendHorizontal />
              </Button>
            </form>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center justify-center h-full">
            <h2 className="text-2xl pb-3 font-sans ">
              Click on a User to Start Chatting
            </h2>
          </div>
        </>
      )}
    </>
  );
};

export default SingleChat;
