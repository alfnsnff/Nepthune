// ChatMe.tsx
import React, { useState, useContext, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  updateDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import { AuthContext } from "@/context/AuthContext";
import { db } from "@/lib/firebase-config";
import { Button } from "@/components/ui/button";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

interface TargetUserProps {
  targetUser: string;
}

const ChatMe: React.FC<TargetUserProps> = ({ targetUser }) => {
  const [user, setUser] = useState<User | null>(null);
  const { currentUser } = useContext(AuthContext);
  const router = useRouter();

  const fetchUserData = async (targetUser: string) => {
    const q = query(collection(db, "users"), where("uid", "==", targetUser));

    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      setUser(doc.data() as User);
    });
  };

  useEffect(() => {
    // Trigger fetchUserData when targetUser changes
    if (targetUser) {
      fetchUserData(targetUser);
    }
  }, [targetUser]);

  const handleChat = async () => {
    await fetchUserData(targetUser);
    if (!currentUser || !user) {
      return;
    }

    const combinedId =
    currentUser.uid > user.uid
    ? currentUser.uid + user.uid
    : user.uid + currentUser.uid;
    
    console.log("Executed");
    try {
      const res = await getDoc(doc(db, "chats", combinedId));
      if (!res.exists()) {
        await setDoc(doc(db, "chats", combinedId), { messages: [] });
        await updateDoc(doc(db, "userChats", currentUser.uid), {
          [combinedId + ".userInfo"]: {
            uid: user.uid,
            displayName: user.displayName,
            photoURL: user.photoURL,
          },
          [combinedId + ".date"]: serverTimestamp(),
        });

        await updateDoc(doc(db, "userChats", user.uid), {
          [combinedId + ".userInfo"]: {
            uid: currentUser.uid,
            displayName: currentUser.displayName || "",
            photoURL: currentUser.photoURL || "",
          },
          [combinedId + ".date"]: serverTimestamp(),
        });
      }
    } catch {
      console.error("Error creating or updating documents:");
    }

    // Redirect to the chat page
    router.push("/chat");
  };

  return (
    <Button
      className="flex justify-center text-slate-800 bg-transparent w-full h-full rounded-lg border border-gray-700 p-4 hover:bg-gray-50 hover:border-pink-600"
      onClick={handleChat}
    >
      Text Me
    </Button>
  );
};

export default ChatMe;
