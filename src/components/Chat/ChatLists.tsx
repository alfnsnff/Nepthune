import {
  doc,
  onSnapshot,
  DocumentSnapshot,
} from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase-config";
import Image from "next/image";

interface Chat {
  [key: string]: {
    date: any;
    lastMessage?: {
      text: string;
      date: any;
    };
    userInfo: {
      displayName: string;
      photoURL: string;
    };
  };
}
// ... (imports)

const ChatLists: React.FC = () => {
  const [chats, setChats] = useState<Chat | null>(null);
  const { dispatch } = useContext(ChatContext);
  const { currentUser } = useContext(AuthContext);

  useEffect(() => {
    if (currentUser && currentUser.uid) {
      const unsubscribe = onSnapshot(
        doc(db, "userChats", currentUser.uid),
        (snapshot: DocumentSnapshot) => {
          setChats(snapshot.data() as Chat | null);
        }
      );

      return () => {
        unsubscribe();
      };
    }
  }, [currentUser]);

  const handleSelect = (u: any) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <>
      {Object.entries(chats || {}) // Use {} as a default value if chats is falsy
        ?.sort((a, b) => (b[1]?.date as any) - (a[1]?.date as any))
        .map((chat) => (
          <div
            className="flex items-center border-b p-2 gap-2.5 bg-white border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            key={chat[0]}
            onClick={() => handleSelect(chat[1]?.userInfo)}
          >
            <img
              className="size-12 rounded-full"
              src={chat[1]?.userInfo.photoURL}
              alt=""
              width={100} // set the width as a number (percentage)
              height={100} // set the height as a number (percentage)
            />
            <div className="grow truncate">
              <span className="font-semibold ">
                {chat[1]?.userInfo.displayName}
              </span>
              <p className="text-gray-500 truncate">
                {chat[1]?.lastMessage?.text}
              </p>
            </div>
            <span className="pt-2.5 text-nowrap self-start text-xs/[1px] font-normal">
              {chat[1]?.lastMessage
                ? new Date(
                    chat[1]?.lastMessage?.date.toDate()
                  ).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "No Message"}
            </span>
          </div>
        ))}
    </>
  );
};

export default ChatLists;
