import React, { useEffect, useState } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase-config";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Message {
  id: string;
  content: string;
  senderId: string;
  timestamp: number;
}

const Chat: React.FC<any> = (props) => {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  const roomRef = collection(db, "chat2_id", room, "messages");

  useEffect(() => {
    const fetchMessages = async () => {
      const currentUser = auth.currentUser;

      if (currentUser) {
        const queryMessages = query(
          roomRef,
          orderBy("timestamp")
        );

        const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
          let messagesData: Message[] = [];
          snapshot.forEach((doc) => {
            messagesData.push({ ...(doc.data() as Message), id: doc.id });
          });
          setMessages(messagesData);
        });

        return unsubscribe;
      }
    };

    fetchMessages();
  }, [room, roomRef]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage === "") return;

    try {
      const currentUser = auth.currentUser;

      if (currentUser) {
        await addDoc(roomRef, {
          content: newMessage,
          timestamp: serverTimestamp(),
          senderId: currentUser.uid,
        });

        setNewMessage("");
      }
    } catch (error: any) {  // Explicitly type the error variable
      console.error("Error sending message:", error.message);
    }
  };

  const renderMessages = () => {
    return messages.map((message) => (
      <div
        className={`message flex mb-2 text-white ${
          auth.currentUser?.uid === message.senderId ? "justify-end" : ""
        }`}
        key={message.id}
      >
        <div className="bg-black px-3 py-1 rounded-xl">{message.content}</div>
      </div>
    ));
  };

  return (
    <div className="chat-app w-full">
      <div className="header px-4 py-2 bg-black rounded text-white">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
      <div className="messages p-2 h-96 overflow-y-auto no-scrollbar flex flex-col-reverse">
        {renderMessages()}
      </div>
      <form onSubmit={handleSubmit} className="new-message-form flex space-x-4">
        <Input
          className="new-message-input"
          placeholder="Type your message here.."
          onChange={(e) => setNewMessage(e.target.value)}
          value={newMessage}
        />
        <Button type="submit" className="send-button">
          Send
        </Button>
      </form>
    </div>
  );
};

export default Chat;
