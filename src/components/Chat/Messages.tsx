import { doc, onSnapshot, DocumentData } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { db } from "@/lib/firebase-config";
import Message from "@/components/Chat/MessageBubble";

interface MessageData {
  id: string;
  senderId: string;
  text: string;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      doc.exists() && setMessages(doc.data()?.messages || []);
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);


  return (
    <div className="flex flex-col justify-end h-full p-4 gap-2.5 text-md overflow-y-auto no-scrollbar">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
