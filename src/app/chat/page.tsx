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
    onAuthStateChanged(auth, (user: any) => {
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
        {/* <Breadcrumb pageName="Discuss" /> */}

        <div className="flex m-24 p-12 border-2 rounded-xl space-x-5 ">
          <div className="room space-y-2 w-1/3 ">
            {/* <label className="px-4">Enter Room Name : </label> */}
            <div className="flex space-x-4">
              <Input 
              placeholder="Room here ..."
              ref={roomInputRef} />
              <Button
                type="submit"
                onClick={() => setRoom(roomInputRef.current.value)}
              >
                Enter Chat
              </Button>
            </div>
          </div>
          <span className="border-r-2"></span>
          <Chatroom room={room}/>
        </div>
      </>
    );
  }
}
