"use client";
import Signin from "@/components/Auth/SignIn";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import Breadcrumb from "@/components/common/Breadcrumb";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  setDoc,
  doc,
} from "firebase/firestore";
import { Message } from "postcss";

// ... (previous imports)

const chatsCollection = collection(db, "chats");

export default function Chat() {
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);

  // No Used
  // const roomInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser && room) {
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

  const handleUserButtonClick = async (buttonUid: string) => {
    const combinedId = `${user?.uid > buttonUid ? user.uid : buttonUid}&&${
      user?.uid > buttonUid ? buttonUid : user?.uid
    }`;

    // Add the user to the members field in the chat document
    const chatRef = doc(chatsCollection, combinedId);
    await setDoc(
      chatRef,
      {
        members: {
          [user?.uid]: true,
          [buttonUid]: true,
        },
      },
      { merge: true }
    );

    setRoom(combinedId);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (newMessage === "") return;

    const currentUser = auth.currentUser;

    if (currentUser && room) {
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
        <div className="flex m-24 border-2 rounded-xl ">
          <div className="room space-y-2 w-1/3 ">
            {/* No Used */}
            {/* <div className="flex space-x-4">
              <Input placeholder="Room here ..." ref={roomInputRef} />
              <Button
                type="submit"
                onClick={() => setRoom(roomInputRef.current?.value || "")}
              >
                Enter Chat
              </Button>
            </div> */}
            <div className="font-bold text-xl flex flex-col pt-10">
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
                  disabled={user?.uid === uid}
                  className="rounded-none"
                >
                  {name}
                </Button>
              ))}
            </div>
          </div>
          <span className="border-r-2"></span>
          <div className="w-full">
            <div className="px-4 py-2 bg-black text-white rounded-tr-lg">
              <h1>Welcome to: {room.toUpperCase()}</h1>
            </div>
            <div className="p-2 h-96 overflow-y-auto no-scrollbar flex flex-col-reverse">
              {messages
                .slice()
                .reverse()
                .map((message) => (
                  <div
                    className={`flex mb-2 text-white ${
                      user?.uid === message.senderId ? "justify-end" : ""
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
              className="flex space-x-4"
            >
              <Input
                className="rounded-none"
                placeholder="Type your message here.."
                onChange={(e) => setNewMessage(e.target.value)}
                value={newMessage}
              />
              <Button type="submit" className="rounded-none rounded-br-lg">
                Send
              </Button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
