"use client";
import Signin from "@/components/Auth/SignIn";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
} from "firebase/firestore";
import { Message } from "postcss";

export default function Chat() {
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState("");
  const roomInputRef = useRef<HTMLInputElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const chatsCollection = collection(db, "chats");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const queryMessages = query(
        collection(chatsCollection, room, "messages"),
        orderBy("timestamp")
      );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const messagesData: Message[] = snapshot.docs.map((doc) => ({
          ...(doc.data() as Message),
          id: doc.id,
        }));
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [room]);

  const handleUserButtonClick = (buttonUid: string) => {
    const combinedId = `${user.uid > buttonUid ? user.uid : buttonUid}&&${
      user.uid > buttonUid ? buttonUid : user.uid
    }`;
    setRoom(combinedId);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (newMessage === "") return;

    const currentUser = auth.currentUser;

    if (currentUser) {
      const chatRef = collection(chatsCollection, room, "messages");

      await addDoc(chatRef, {
        content: newMessage,
        senderId: currentUser.uid,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    }
  };

  return (
    <>
      {!user ? (
        <>
          <Breadcrumb pageName="Discuss" />
          <Signin />
        </>
      ) : (
        <div className="flex m-24 p-12 border-2 rounded-xl space-x-5 ">
          <div className="room space-y-2 w-1/3 ">
            {/* <div className="flex space-x-4">
              <Input placeholder="Room here ..." ref={roomInputRef} />
              <Button
                type="submit"
                onClick={() => setRoom(roomInputRef.current?.value || "")}
              >
                Enter Chat
              </Button>
            </div> */}
            <div className="font-bold text-xl space-y-2 flex flex-col">
              {[
                { uid: "ONZsXmXNIhUcuwSV50KBJoRNEap2", name: "AlfanEdge" },
                { uid: "Jx9eUrVXqAXSGvUQ2eRHqSgDkpl2", name: "AlfanChrome" },
                { uid: "ozHKyC8TTneFyxVQzWNcP0H0Whk2", name: "Rifa" },
                { uid: "5MWbqmNUVCRpDKaqCC7wKkRZVG83", name: "Ryparuk" },
                { uid: "LyFCbY1nTcTmYbPwbWNlbJHuoAX2", name: "Rifausk" },
                { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
              ].map(({ uid, name }) => (
                <Button
                  key={uid}
                  type="submit"
                  onClick={() => handleUserButtonClick(uid)}
                  disabled={user.uid === uid}
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
          <span className="border-r-2"></span>
          <div className="chat-app w-full ">
            <div className="header px-4 py-2 bg-black rounded text-white">
              <h1>Welcome to: {room.toUpperCase()}</h1>
            </div>
            <div className="messages p-2 h-96 overflow-y-auto no-scrollbar flex flex-col-reverse">
              {messages
                .slice()
                .reverse()
                .map((message) => (
                  <div
                    className={`message flex mb-2 text-white ${
                      auth.currentUser?.uid === message.senderId
                        ? "justify-end"
                        : ""
                    }`}
                    key={message.id}
                  >
                    <div className="bg-black px-3 py-1 rounded-xl">
                      {message.content}
                    </div>
                  </div>
                ))}
            </div>
            <form
              onSubmit={handleSubmit}
              className="new-message-form flex space-x-4"
            >
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
        </div>
      )}
    </>
  );
}
