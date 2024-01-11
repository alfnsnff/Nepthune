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

export default function Chat(props: any) {
  const { room } = props;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const messagesRef = collection(db, "newmessages");

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const queryMessages = query(
        messagesRef,
        where("room", "==", room),
        orderBy("createdAt")
      );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        let messagesData: any = [];
        snapshot.forEach((doc) => {
          messagesData.push({ ...doc.data(), id: doc.id });
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [room]);

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (newMessage === "") return;

    const currentUser = auth.currentUser;

    if (currentUser) {
      await addDoc(messagesRef, {
        text: newMessage,
        createdAt: serverTimestamp(),
        user: currentUser.displayName,
        room,
        uid: currentUser.uid,
      });

      setNewMessage("");
    }
  };

  return (
    <div className="chat-app w-full ">
      <div className="header px-4 py-2 bg-black rounded text-white">
        <h1>Welcome to: {room.toUpperCase()}</h1>
      </div>
      <div className="messages p-2 max-h-96 overflow-y-auto no-scrollbar">
        {messages.map((message) => (
          <div
            className={`message flex mb-2 text-white ${
              auth.currentUser?.uid === message.uid
                ? "justify-end"
                : ""
            }`}
            key={message.id}
          >
            <div className="bg-black px-3 py-1 rounded-xl">
              {/* <span className="user font-bold pr-2 s">{message.user}</span> */}
              {message.text}
            </div>
          </div>
        ))}
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
}
