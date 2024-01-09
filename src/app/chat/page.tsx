"use client";
import Chatroom from "@/components/chat/ChatRoom";
import Breadcrumb from "@/components/common/Breadcrumb";
import Signin from "@/components/Auth/SignIn";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useRef, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase-config";

export default function Home() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    onAuthStateChanged(auth, (user:any) => {
      setUser(user);
    });
  }, []);

  const [room, setRoom] = useState("");
  const roomInputRef = useRef(null);

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
        <Breadcrumb pageName="Discuss" />
        {room ? (
          <Chatroom room={room} />
        ) : (
          <div className="room mx-24 space-y-2">
            <label className="px-4">Enter Room Name : </label>
            <div className="flex space-x-4">
              <Input ref={roomInputRef} />
              <Button type="submit" onClick={() => setRoom(roomInputRef.current.value)}>
                Enter Chat
              </Button>
            </div>
          </div>
        )}
      </>
    );
  }
}
