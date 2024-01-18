



// Not Used

"use client";
import Signin from "@/components/Auth/SignIn";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import {
  collection,
  onSnapshot,
  query,
  where,
  orderBy,
  setDoc,
  doc,
  getDoc,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Message } from "postcss";

const chatsCollection = collection(db, "chats");
const usersCollection = collection(db, "users");

export default function Chat() {
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatRooms, setChatRooms] = useState<any[]>([]);
  const roomInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      const roomsQuery = query(
        chatsCollection,
        where(`members.${currentUser.uid}.isMember`, "==", true)
      );

      const unsubscribe = onSnapshot(roomsQuery, (snapshot) => {
        const roomsData: any[] = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...(doc.data() as any),
        }));
        setChatRooms(roomsData);
      });

      return () => unsubscribe();
    }
  }, [user]);

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

    const userDocRef = doc(usersCollection, buttonUid);
    const userDoc = await getDoc(userDocRef);
    const username = userDoc.data()?.username || buttonUid;

    const chatRef = doc(chatsCollection, combinedId);
    await setDoc(
      chatRef,
      {
        members: {
          [user?.uid]: {
            username: user?.displayName,
            isMember: true,
          },
          [buttonUid]: {
            username: username,
            isMember: true,
          },
        },
      },
      { merge: true }
    );

    setRoom(combinedId);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
          <div className="h-[520px] mt-24 flex m-16 border drop-shadow">
            <div className="w-2/5 overflow-y-auto no-scrollbar">
              <div className="sticky top-0 px-4 py-4 bg-white drop-shadow">
                <h1>Your Chat Rooms</h1>
              </div>
              <div className="font-bold text-xl flex flex-col ">
                <Button
                  onClick={() =>
                    handleUserButtonClick("PSKpxPkzmCWVpMZcXNYNJAnep7e2")
                  }
                >
                  test
                </Button>
                <ul>
                  {chatRooms.map((room) => (
                    <li key={room.id}>
                      <span
                        className="block px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
                        onClick={() => setRoom(room.id)}
                      >
                        <h5 className="text-[16px] font-bold tracking-tight text-gray-900 dark:text-white">
                          {Object.keys(room.members).map((uid: string) => {
                            const member = room.members[uid];
                            // Check if the member is not the current user and has isMember set to true
                            if (uid !== user?.uid && member.isMember) {
                              return <span key={uid}>{member.username}</span>;
                            }
                            return null; // If the member is the current user or isMember is not true, return null
                          })}
                        </h5>
                        <p className="text-xs font-normal text-gray-700 dark:text-gray-400">
                          Text Message
                        </p>
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <span className="border-r-2"></span>
            {room ? (
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
                          user?.uid === message.senderId
                            ? "flex-row-reverse"
                            : ""
                        }`}
                      >
                        <img
                          className="w-8 h-8 rounded-full"
                          src="https://picsum.photos/200/300"
                          alt="Jese image"
                        />
                        <div
                          className={`flex max-w-[320px] leading-1.5 p-3 items-end border-gray-200 dark:bg-gray-700 ${
                            user?.uid === message.senderId
                              ? "rounded-s-xl rounded-ee-xl bg-green-400"
                              : "rounded-e-xl rounded-es-xl bg-white"
                          }`}
                        >
                          <p className="text-md font-normal  text-gray-900 dark:text-white">
                            {message.content}
                          </p>
                          <span className="pl-2 text-xs/[1px] font-normal text-gray-500 dark:text-gray-400">
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
                    ))}
                </div>
                <form onSubmit={handleSubmit}>
                  {/* <label for="chat" className="sr-only">Your message</label> */}
                  <div className="flex items-center px-3 py-2 gap-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <button
                      type="button"
                      className="inline-flex justify-center p-2 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
                      className="p-2 text-gray-500 rounded-lg cursor-pointer hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-600"
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
                    <button
                      type="submit"
                      className="inline-flex justify-center p-2 text-gray-600 rounded-full cursor-pointer hover:bg-gray-100 dark:text-gray-500 dark:hover:bg-blue-600"
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
            ) : (
              <div className="w-full bg-gray-50 h-full flex flex-col">
                <div className="px-4 py-4 bg-white drop-shadow">
                  {room ? <h1>{room.toUpperCase()}</h1> : <h1>Discuss</h1>}
                </div>
                <div className="flex flex-col h-full justify-center items-center text-slate-800 gap-2">
                  <h1 className="font-bold text-xl">Selamat Datang di Chat</h1>
                  <h1 className="text-slate-600">
                    Pilih pesan untuk mulai percakapan
                  </h1>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </>
  );
}
