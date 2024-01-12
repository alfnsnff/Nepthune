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
          {/* <Breadcrumb pageName="Discuss" /> */}
          <Signin />
        </>
      ) : (
        <>
          <div className="h-[520px] mt-24 flex m-16 border-1 drop-shadow">
            <div className="space-y-2 w-2/5 overflow-y-auto no-scrollbar">
              <div className="sticky top-0 px-4 py-4 bg-white drop-shadow">
                <h1>Discuss</h1>
              </div>
              <div className="font-bold text-xl flex flex-col ">
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
              <div className="px-4 py-4 bg-white drop-shadow">
                {room ? <h1>{room.toUpperCase()}</h1> : <h1>Discuss</h1>}
              </div>
              <div className="px-8 pt-2 text-md h-full overflow-y-auto no-scrollbar flex flex-col-reverse">
                {messages
                  .slice()
                  .reverse()
                  .map((message) => (
                    <div
                      className={`flex mb-4 items-start gap-2.5 drop-shadow-sm ${
                        user?.uid === message.senderId ? "flex-row-reverse" : ""
                      }`}
                    >
                      <img
                        className="w-8 h-8 rounded-full"
                        src="https://picsum.photos/200/300"
                        alt="Jese image"
                      />
                      <div
                        className={`flex max-w-[320px] leading-1.5 p-4 items-end border-gray-200 dark:bg-gray-700 ${
                          user?.uid === message.senderId
                            ? "rounded-s-xl rounded-ee-xl bg-green-400"
                            : "rounded-e-xl rounded-es-xl bg-white"
                        }`}
                      >
                        <p className="text-md font-normal  text-gray-900 dark:text-white">
                          {message.content}
                        </p>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-xs/[1px] font-normal text-gray-500 dark:text-gray-400">
                            {" "}
                            {new Date(
                              message.timestamp?.seconds * 1000
                            ).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
              <form onSubmit={handleSubmit}>
                {/* <label for="chat" className="sr-only">Your message</label> */}
                <div className="flex items-center px-3 py-2 gap-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <button
                    type="button"
                    className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 18"
                    >
                      <path
                        fill="currentColor"
                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z"
                      />
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z"
                      />
                    </svg>
                    <span className="sr-only">Upload image</span>
                  </button>
                  <button
                    type="button"
                    className="p-2 text-gray-500 rounded-lg cursor-pointer hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 20 20"
                    >
                      <path
                        stroke="currentColor"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M13.408 7.5h.01m-6.876 0h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0ZM4.6 11a5.5 5.5 0 0 0 10.81 0H4.6Z"
                      />
                    </svg>
                    <span className="sr-only">Add emoji</span>
                  </button>
                  <Input
                    placeholder="Type your message here.."
                    onChange={(e) => setNewMessage(e.target.value)}
                    value={newMessage}
                  />
                  {/* <textarea id="chat" rows="1" className="block mx-4 p-2.5 w-full text-sm text-gray-900 bg-white rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Your message..."></textarea> */}
                  <button
                    type="submit"
                    className="inline-flex justify-center p-2 text-blue-600 rounded-full cursor-pointer hover:bg-blue-100 dark:text-blue-500 dark:hover:bg-gray-600"
                  >
                    <svg
                      className="w-5 h-5 rotate-90 rtl:-rotate-90"
                      aria-hidden="true"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="currentColor"
                      viewBox="0 0 18 20"
                    >
                      <path d="m17.914 18.594-8-18a1 1 0 0 0-1.828 0l-8 18a1 1 0 0 0 1.157 1.376L8 18.281V9a1 1 0 0 1 2 0v9.281l6.758 1.689a1 1 0 0 0 1.156-1.376Z" />
                    </svg>
                  </button>
                </div>
              </form>
            </div>
          </div>
        </>
      )}
    </>
  );
}
