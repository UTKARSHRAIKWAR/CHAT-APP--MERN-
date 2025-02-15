import axios from "axios";
import { useEffect, useState } from "react";

const ChatPage = () => {
  const [chats, setChats] = useState([]);
  const fetchChats = async () => {
    const { data } = await axios.get("/api/chats");

    setChats(data);
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div>
      {chats.map((chats) => (
        <div key={chats._id}>{chats.chatName}</div>
      ))}
    </div>
  );
};

export default ChatPage;
