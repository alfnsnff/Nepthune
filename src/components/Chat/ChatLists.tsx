import { doc, onSnapshot, DocumentSnapshot } from "firebase/firestore";
import React, { useContext, useEffect, useState } from "react";
import { ChatContext } from "@/context/ChatContext";
import { auth, db } from "@/lib/firebase-config";

interface Chat {
  [key: string]: {
    date: Date;
    lastMessage?: {
      text: string;
    };
    userInfo: {
      displayName: string;
      photoURL: string;
    };
  };
}

const ChatLists: React.FC = () => {
  const [chats, setChats] = useState<Chat>({});

  const currentUser = auth.currentUser;
  const { dispatch } = useContext(ChatContext);

  useEffect(() => {
    const getChats = () => {
      // Check if currentUser is not null before accessing uid
      if (currentUser && currentUser.uid) {
        const unsub = onSnapshot(
          doc(db, "userChats", currentUser.uid),
          (snapshot: DocumentSnapshot) => {
            setChats(snapshot.data() as Chat);
          }
        );

        return () => {
          unsub();
        };
      }
    };

    // Make sure to call getChats only when currentUser.uid changes
    currentUser?.uid && getChats();
  }, [currentUser?.uid]);

  const handleSelect = (u: any) => {
    dispatch({ type: "CHANGE_USER", payload: u });
  };

  return (
    <>
      {Object.entries(chats)
        ?.sort((a, b) => (b[1].date as any) - (a[1].date as any))
        .map((chat) => (
          <div
            className="flex items-center p-4 gap-2.5 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            key={chat[0]}
            onClick={() => handleSelect(chat[1].userInfo)}
          >
            <img
              className="size-12 rounded-full "
              src={chat[1].userInfo.photoURL}
              alt=""
            />
            <div className="">
              <span className="font-semibold ">{chat[1].userInfo.displayName}</span>
              <p className="text-gray-500">{chat[1].lastMessage?.text}</p>
            </div>
          </div>
        ))}
    </>
  );
};

export default ChatLists;
