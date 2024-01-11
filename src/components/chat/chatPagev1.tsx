"use client";
import React, { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";
import Breadcrumb from "@/components/common/Breadcrumb";
import Signin from "@/components/Auth/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Chatroom from "@/components/chat/ChatRoom";

export default function chat() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user: any) => {
      setUser(user);
    });
  }, []);

  const user1Uid = "ONZsXmXNIhUcuwSV50KBJoRNEap2";
  const user2Uid = "Jx9eUrVXqAXSGvUQ2eRHqSgDkpl2";
  const user3Uid = "ozHKyC8TTneFyxVQzWNcP0H0Whk2";

  const [room, setRoom] = useState("");
  const roomInputRef = useRef<HTMLInputElement | null>(null);

  const handleUserButtonClick = (buttonUid: string) => {
    const combinedId =
      user.uid > buttonUid ? user.uid + "&&" + buttonUid : buttonUid + "&&" +user.uid;
    setRoom(combinedId);
  };

  if (!user) {
    return (
      <>
        <Breadcrumb pageName="Discuss" />
        <Signin />
      </>
    );
  } else {
    return (
      <>
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
              <Button
                type="submit"
                onClick={() => handleUserButtonClick(user1Uid)}
                disabled={user.uid === user1Uid}
              >
                AlfanEdge
              </Button>
              <Button
                type="submit"
                onClick={() => handleUserButtonClick(user2Uid)}
                disabled={user.uid === user2Uid}
              >
                AlfanChrome
              </Button>
              <Button
                type="submit"
                onClick={() => handleUserButtonClick(user3Uid)}
                disabled={user.uid === user3Uid}
              >
                Rifa
              </Button>
            </div>
          </div>
          <span className="border-r-2"></span>
          <Chatroom room={room} />
        </div>
      </>
    );
  }
}
