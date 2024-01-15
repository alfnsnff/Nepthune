import React, { useState, ChangeEvent, KeyboardEvent } from "react";
import { auth, db } from "@/lib/firebase-config";
import {
  collection,
  query,
  where,
  setDoc,
  doc,
  getDoc,
  getDocs,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { Input } from "@/components/ui/input";

interface User {
  uid: string;
  displayName: string;
  photoURL: string;
}

const SearchUser: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [user, setUser] = useState<User | null>(null);
  const [err, setErr] = useState<boolean>(false);

  const currentUser = auth.currentUser;

  const handleSearch = async () => {
    const q = query(
      collection(db, "users"),
      where("displayName", "==", username)
    );

    try {
      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        setUser(doc.data() as User);
      });
    } catch (err) {
      setErr(true);
    }
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === "Enter") {
      handleSearch();
    }
  };

  const handleSelect = async () => {
    if (!currentUser || !user) {
      return;
    }

    // Check whether the group (chats in firestore) exists, if not create
    const combinedId =
      currentUser.uid > user.uid
        ? currentUser.uid + user.uid
        : user.uid + currentUser.uid;

    try {
      const res = await getDoc(doc(db, "chats", combinedId));

      if (!res.exists()) {
        // Create a chat in chats collection
        await setDoc(doc(db, "chats", combinedId), { messages: [] });

        // Create user chats
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
    } catch (err) {}

    setUser(null);
    setUsername("");
  };

  return (
    <>
        <div className="">
          <Input
            type="text"
            placeholder="Search user here"
            onKeyDown={handleKey}
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setUsername(e.target.value)
            }
            value={username}
            // className=""
          />
        </div>
        {err && <span>User not found!</span>}
        {user && (
          <div
            className="block px-4 py-2 bg-white border border-gray-200 hover:bg-gray-100 dark:bg-gray-800 dark:border-gray-700 dark:hover:bg-gray-700"
            onClick={handleSelect}
          >
            <img src={user.photoURL} alt="" />
            <div className="userChatInfo">
              <span className="">{user.displayName}</span>
            </div>
          </div>
        )}
    </>
  );
};

export default SearchUser;


