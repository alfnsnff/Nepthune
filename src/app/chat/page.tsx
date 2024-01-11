"use client";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "@/lib/firebase-config";
import Breadcrumb from "@/components/common/Breadcrumb";
import Signin from "@/components/Auth/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Chatroom from "@/components/chat/ChatRoom";
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

// Other imports...

// Other necessary imports...

export default function Chat() {
  const [user, setUser] = useState<any>(null);
  const [room, setRoom] = useState("");
  const roomInputRef = useRef<HTMLInputElement | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesRef = collection(db, "newmessages");

  const user1Uid = "ONZsXmXNIhUcuwSV50KBJoRNEap2";
  const user2Uid = "Jx9eUrVXqAXSGvUQ2eRHqSgDkpl2";
  const user3Uid = "ozHKyC8TTneFyxVQzWNcP0H0Whk2";

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
        messagesRef,
        where("room", "==", room),
        orderBy("createdAt")
      );

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        const messagesData: Message[] = [];
        snapshot.forEach((doc) => {
          messagesData.push({ ...(doc.data() as Message), id: doc.id });
        });
        setMessages(messagesData);
      });

      return () => unsubscribe();
    }
  }, [room]);

  const handleUserButtonClick = (buttonUid: string) => {
    const combinedId = `${user.uid > buttonUid ? user.uid : buttonUid}&&${user.uid > buttonUid ? buttonUid : user.uid}`;
    setRoom(combinedId);
  };

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
    <>
      {!user ? (
        <>
          <Breadcrumb pageName="Discuss" />
          <Signin />
        </>
      ) : (
        <div className="flex m-24 p-12 border-2 rounded-xl space-x-5 ">
          <div className="room space-y-2 w-1/3 ">
            <div className="flex space-x-4">
              <Input placeholder="Room here ..." ref={roomInputRef} />
              <Button
                type="submit"
                onClick={() => setRoom(roomInputRef.current?.value || "")}
              >
                Enter Chat
              </Button>
            </div>
            <div className="font-bold text-xl space-y-2 flex flex-col">
              {[
                { uid: user1Uid, name: "AlfanEdge" },
                { uid: user2Uid, name: "AlfanChrome" },
                { uid: user3Uid, name: "Rifa" },
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
          <Chatroom room={room} messages={messages} newMessage={newMessage} handleSubmit={handleSubmit} />
        </div>
      )}
    </>
  );
}
