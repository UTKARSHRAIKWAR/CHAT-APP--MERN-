import {
  isSameSender,
  lastMessage,
  isSameUser,
  isSameSenderMargin,
} from "@/config/chatLogic";
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
          <div
            className={`flex items-end ${
              m.sender._id === user._id ? "justify-end" : "justify-start"
            }`}
            key={m._id}
          >
            {((m.sender._id !== user._id &&
              isSameSender(messages, m, i, user._id)) ||
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
              className={`max-w-[75%] px-4 py-2 rounded-[20px] text-black break-words
    ${isSameSenderMargin(messages, m, i, user._id)}
    ${isSameUser(messages, m, i) ? "mt-1" : "mt-3"}
    ${
      m.sender._id === user._id
        ? "bg-[#BEE3F8] self-end"
        : "bg-[#B9F5D0] self-start"
    }
    `}
            >
              {m.content}
            </div>
          </div>
        ))}
    </ScrollableFeed>
  );
};

export default ScrollableChat;
