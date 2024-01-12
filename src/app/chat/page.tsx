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
} from "@/components/ui/command";

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
  const roomInputRef = useRef<HTMLInputElement | null>(null);

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
        <>
          <div className="h-[520px] mt-24 flex m-16 border-2 rounded-xl drop-shadow">
            <div className="space-y-2 w-2/5 overflow-y-auto no-scrollbar">
              {/* <div className="flex space-x-4">
                <Input placeholder="Room here ..." ref={roomInputRef} />
                <Button
                  type="submit"
                  onClick={() => setRoom(roomInputRef.current?.value || "")}
                >
                  Enter Chat
                </Button>
              </div> */}
              <div className="font-bold text-xl flex flex-col">
                {[
                  { uid: "ONZsXmXNIhUcuwSV50KBJoRNEap2", name: "AlfanEdge" },
                  { uid: "Jx9eUrVXqAXSGvUQ2eRHqSgDkpl2", name: "AlfanChrome" },
                  { uid: "ozHKyC8TTneFyxVQzWNcP0H0Whk2", name: "Rifa" },
                  { uid: "5MWbqmNUVCRpDKaqCC7wKkRZVG83", name: "Ryparuk" },
                  { uid: "LyFCbY1nTcTmYbPwbWNlbJHuoAX2", name: "Rifausk" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                  { uid: "nZv5OgXYLzQTx9U13LNMQIfZFJX2", name: "Habil" },
                ].map(({ uid, name }) => (
                  <Button
                    key={uid}
                    type="submit"
                    onClick={() => handleUserButtonClick(uid)}
                    disabled={user?.uid === uid}
                    className="rounded-none py-8 bg-white text-black hover:bg-slate-300 border-b"
                  >
                    {name}
                  </Button>
                ))}
              </div>
            </div>
            <span className="border-r-2"></span>
            <div className="w-full bg-blue-50 h-full flex flex-col justify-between">
              <div className="px-4 py-4 bg-white rounded-tr-lg drop-shadow">
                {room ? (
                  <h1>{room.toUpperCase()}</h1>
                ) : (
                  <h1>Discuss</h1>
                )}
              </div>
              <div className="py-4 space-y-2 text-md overflow-y-auto no-scrollbar flex flex-col-reverse">
                {messages
                  .slice()
                  .reverse()
                  .map((message) => (
                    <div
                      className={`flex ${
                        user?.uid === message.senderId ? "justify-end" : ""
                      }`}
                      key={message.id}
                    >
                      <div
                        className={` px-4 py-2 rounded-xl  ${
                          user?.uid === message.senderId
                            ? "rounded-tr-none bg-green-400"
                            : "rounded-tl-none bg-white"
                        }`}
                        key={message.id}
                      >
                        <div className="flex items-end">
                          {message.content}
                          <div className="text-gray-500 justify-self-end text-xs/[1px] pl-2 pb-1">
                            {new Date(
                              message.timestamp?.seconds * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleSubmit} className="flex">
                <Input
                  className="rounded-none"
                  placeholder="Type your message here.."
                  onChange={(e) => setNewMessage(e.target.value)}
                  value={newMessage}
                />
                <Button
                  type="submit"
                  className="rounded-none rounded-br-lg bg-green-400"
                >
                  Send
                </Button>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}