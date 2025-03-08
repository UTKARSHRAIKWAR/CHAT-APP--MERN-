import { isSameSender, lastMessage } from "@/config/chatLogic";
import { ChatState } from "@/context/ChatProvider";
import ScrollableFeed from "react-scrollable-feed";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const ScrollableChat = ({ messages }) => {
  const { user } = ChatState();
  return (
    <ScrollableFeed>
      {messages &&
        messages.map((m, i) => (
          <div className="flex" key={m._id}>
            {(isSameSender(messages, m, i, user._id) ||
              lastMessage(messages, i, user._id)) && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src={m.sender.pic} />
                      <AvatarFallback>{m.sender.name}</AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{m.sender.name}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            <div
              className={`max-w-[75%] px-4 py-2 rounded-[20px] text-black break-words ${
                m.sender._id === user._id ? "bg-[#BEE3F8]" : "bg-[#B9F5D0]"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
