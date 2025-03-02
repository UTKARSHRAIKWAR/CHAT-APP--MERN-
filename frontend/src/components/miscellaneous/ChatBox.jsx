import { ChatState } from "@/context/ChatProvider";
import SingleChat from "./SingleChat";

const ChatBox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();
  return (
    <div
      className={` 
       ${selectedChat ? "flex" : "hidden"} md:flex
      md:flex flex items-center flex-col p-3 bg-white rounded-lg w-full md:w-[68%] h-[100%]`}
    >
      <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
    </div>
  );
};

export default ChatBox;
