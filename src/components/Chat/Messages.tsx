import { doc, onSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { db } from "@/lib/firebase-config";
import Message from "@/components/Chat/MessageBubble";

interface MessageData {
  id: string;
  senderId: string;
  text: string;
  date: any;
}

const Messages: React.FC = () => {
  const [messages, setMessages] = useState<MessageData[]>([]);
  const [loading, setLoading] = useState(true); // Added loading state
  const { data } = useContext(ChatContext);

  useEffect(() => {
    const unSub = onSnapshot(doc(db, "chats", data.chatId), (doc) => {
      if (doc.exists()) {
        setMessages(doc.data()?.messages || []);
        setLoading(false); // Set loading to false when data is fetched
      } else {
        setLoading(false); // Set loading to false if the document doesn't exist
      }
    });

    return () => {
      unSub();
    };
  }, [data.chatId]);

  // Show loading indicator while data is being fetched
  if (loading) {
    return (
      <div className="flex h-full justify-center items-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full p-4 gap-2.5 text-md overflow-y-scroll no-scrollbar">
      {messages.map((m) => (
        <Message message={m} key={m.id} />
      ))}
    </div>
  );
};

export default Messages;
