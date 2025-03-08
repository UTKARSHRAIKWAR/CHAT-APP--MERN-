import { ChatState } from "@/context/ChatProvider";
import { Button } from "../ui/button";
import { ArrowLeft } from "lucide-react";
import { getSender, getSenderFull } from "@/config/chatLogic";
import ProfileDialogSelected from "../dailogs/SelectedProfileDialoge";
import UpdateGroupChat from "./UpdateGroupChat";
import { useEffect, useState } from "react";
import { ColorRing } from "react-loader-spinner";
import { Input } from "../ui/input";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import ScrollableChat from "./ScrollableChat";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

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
      console.log(messages);
      setMessages(data);

      setLoading(false);
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
    fetchMessages();
  }, [selectedChat]);

  const sendMessage = async (event) => {
    if (event.key === "Enter" && newMessage) {
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
        setNewMessage("");
      } catch (error) {
        toast({
          title: "Something Went Wrong!",
          description: error.message,
          variant: "destructive",
          duration: 3000,
        });
      }
    }
  };

  const typingHandler = (e) => {
    setNewMessage(e.target.value);
  };
  return (
    <>
      {selectedChat ? (
        <>
          <div className=" flex justify-between  items-center pb-3 px-2 w-full font-sans text-[28px] md:text-[30px]">
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
                {getSender(user, selectedChat.users)}{" "}
                <ProfileDialogSelected
                  user={getSenderFull(user, selectedChat.users)}
                />{" "}
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
              </div>
            )}
            <form onKeyDown={sendMessage} className="mt-3">
              <Input
                variant="filled"
                className="bg-[#E0E0E0]"
                onChange={typingHandler}
                placeholder="Enter a message..."
                value={newMessage || ""}
              />
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

// import { ChatState } from "@/context/ChatProvider";
// import { Button } from "../ui/button";
// import { ArrowLeft } from "lucide-react";
// import { getSender, getSenderFull } from "@/config/chatLogic";
// import ProfileDialogSelected from "../dailogs/SelectedProfileDialoge";
// import UpdateGroupChat from "./UpdateGroupChat";
// import { useState, useEffect } from "react";
// import { ColorRing } from "react-loader-spinner";
// import { Input } from "../ui/input";
// import axios from "axios";
// import { useToast } from "@/hooks/use-toast";

// const SingleChat = ({ fetchAgain, setFetchAgain }) => {
//   const { user, selectedChat, setSelectedChat } = ChatState();
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState("");
//   const [loading, setLoading] = useState(false);
//   const { toast } = useToast();

//   // Fetch messages when a chat is selected
//   useEffect(() => {
//     if (selectedChat) {
//       fetchMessages();
//     }
//   }, [selectedChat]);

//   const fetchMessages = async () => {
//     if (!selectedChat) return;
//     setLoading(true);
//     try {
//       const config = {
//         headers: {
//           Authorization: `Bearer ${user.token}`,
//         },
//       };
//       const { data } = await axios.get(
//         `/api/message/${selectedChat._id}`,
//         config
//       );
//       setMessages(data);
//     } catch (error) {
//       toast({
//         title: "Error loading messages",
//         description: error.message,
//         variant: "destructive",
//       });
//     }
//     setLoading(false);
//   };

//   const typingHandler = (e) => {
//     setNewMessage(e.target.value);
//   };

//   const sendMessage = async (event) => {
//     if (event.key === "Enter" && newMessage.trim() !== "") {
//       try {
//         const config = {
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${user.token}`,
//           },
//         };
//         const { data } = await axios.post(
//           "/api/message",
//           {
//             content: newMessage,
//             chatId: selectedChat._id,
//           },
//           config
//         );
//         setMessages([...messages, data]);
//         setNewMessage(""); // Clear input after sending
//       } catch (error) {
//         toast({
//           title: "Something Went Wrong!",
//           description: error.message,
//           variant: "destructive",
//         });
//       }
//     }
//   };

//   return (
//     <>
//       {selectedChat ? (
//         <>
//           <div className="flex justify-between items-center pb-3 px-2 w-full font-sans text-[28px] md:text-[30px]">
//             <Button
//               className="flex md:hidden"
//               variant="ghost"
//               size="icon"
//               onClick={() => setSelectedChat(null)}
//             >
//               <ArrowLeft className="w-5 h-5" />
//             </Button>
//             {!selectedChat.isGroupChat ? (
//               <>
//                 {getSender(user, selectedChat.users)}{" "}
//                 <ProfileDialogSelected
//                   user={getSenderFull(user, selectedChat.users)}
//                 />
//               </>
//             ) : (
//               <>
//                 {selectedChat.chatName.toUpperCase()}
//                 <UpdateGroupChat
//                   fetchAgain={fetchAgain}
//                   setFetchAgain={setFetchAgain}
//                 />
//               </>
//             )}
//           </div>

//           <div className="flex flex-col justify-end p-3 bg-[#E8E8E8] w-full h-full rounded-lg overflow-y-hidden">
//             {loading ? (
//               <ColorRing
//                 visible={true}
//                 height="90"
//                 width="90"
//                 ariaLabel="loading"
//                 className="self-center"
//                 colors={["#e15b64", "#f47e60", "#f8b26a", "#abbd81", "#849b87"]}
//               />
//             ) : (
//               <div className="overflow-y-auto h-[400px]">
//                 {messages.map((msg, index) => (
//                   <div key={index} className="p-2 bg-white rounded-md my-1">
//                     <span className="font-bold">{msg.sender.name}: </span>
//                     {msg.content}
//                   </div>
//                 ))}
//               </div>
//             )}

//             <form onKeyDown={sendMessage} className="mt-3">
//               <Input
//                 variant="filled"
//                 className="bg-[#E0E0E0]"
//                 onChange={typingHandler}
//                 placeholder="Enter a message..."
//                 value={newMessage}
//               />
//             </form>
//           </div>
//         </>
//       ) : (
//         <div className="flex items-center justify-center h-full">
//           <h2 className="text-2xl pb-3 font-sans">
//             Click on a User to Start Chatting
//           </h2>
//         </div>
//       )}
//     </>
//   );
// };

// export default SingleChat;
