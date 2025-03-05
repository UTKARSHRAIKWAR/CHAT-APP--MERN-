import { ChatState } from "@/context/ChatProvider";
import { Button } from "../ui/button";
import { ArrowLeft, Loader, LucideLoaderCircle } from "lucide-react";
import { getSender, getSenderFull } from "@/config/chatLogic";
import ProfileDialogSelected from "../dailogs/SelectedProfileDialoge";
import UpdateGroupChat from "./UpdateGroupChat";
import { useState } from "react";
import { ColorRing } from "react-loader-spinner";

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
  const { user, selectedChat, setSelectedChat } = ChatState();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState();
  const [loading, setLoading] = useState(false);
  return (
    <>
      {selectedChat ? (
        <>
          <div className=" flex justify-between  items-center pb-3 px-2 w-full font-sans text-[28px] md:text-[30px]">
            <Button
              className="flex md:hidden"
              variant="ghost"
              size="icon"
              onClick={() => setSelectedChat("")}
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
              <div>{/* messages */}</div>
            )}
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
