"use client";
import React, { useEffect, useState, useRef } from "react";
import {
  addDoc,
  collection,
  serverTimestamp,
  onSnapshot,
  query,
  where,
  orderBy,
  getDocs,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase-config";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface MessageType {
  id: string;
  senderId: string;
  content: string;
  timestamp: any; // Adjust the type accordingly
}

export default function Chat() {
  const { currentUser } = auth;
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState<MessageType[]>([]);
  const [room, setRoom] = useState("");
  const roomInputRef = useRef<HTMLInputElement | null>(null);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (currentUser) {
      const chatRoomId = getChatRoomId(currentUser.uid, room);
      const messagesRef = collection(db, "chats", chatRoomId, "messages");

      const queryMessages = query(messagesRef, orderBy("timestamp"));

      const unsubscribe = onSnapshot(queryMessages, (snapshot) => {
        setMessages((prevMessages) => {
          const newMessages = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          })) as MessageType[]; // Type assertion to MessageType[]
          return [...prevMessages, ...newMessages];
        });
      
        // Scroll to the bottom of the messages container
        const messagesContainer = messagesContainerRef.current;
        if (messagesContainer) {
          messagesContainer.scrollTop = messagesContainer.scrollHeight;
        }
      });
      

      return () => unsubscribe();
    }
  }, [currentUser, room]);

  const getChatRoomId = (userId1: string, userId2: string) =>
    userId1 < userId2 ? `${userId1}_${userId2}` : `${userId2}_${userId1}`;

  const createPrivateChat = async (targetUserId: string) => {
    const currentUserId = currentUser?.uid;

    if (currentUserId && targetUserId) {
      const existingChatRoomId = await getExistingChatRoomId(
        currentUserId,
        targetUserId
      );

      if (existingChatRoomId) {
        // If a chat room already exists, use the existing chat room ID
        setRoom(existingChatRoomId);
      } else {
        // If no chat room exists, create a new one
        const chatRoomId = getChatRoomId(currentUserId, targetUserId);

        // Check if the chat room already exists
        const chatRoomRef = collection(db, "chats");
        const chatRoomDoc = await addDoc(chatRoomRef, {
          members: {
            [currentUserId]: true,
            [targetUserId]: true,
          },
          createdAt: serverTimestamp(),
        });

        // Redirect to the private chat room
        setRoom(chatRoomDoc.id);
      }
    }
  };

  const getExistingChatRoomId = async (
    userId1: string,
    userId2: string
  ): Promise<string | null> => {
    const existingChatRoomQuery = query(
      collection(db, "chats"),
      where(`members.${userId1}`, "==", true),
      where(`members.${userId2}`, "==", true)
    );

    const existingChatRoomSnapshot = await getDocs(existingChatRoomQuery);

    return existingChatRoomSnapshot.empty
      ? null
      : existingChatRoomSnapshot.docs[0].id;
  };

  const handleEnterChat = () => {
    setRoom(roomInputRef.current?.value || "");
  };

  const handleUserButtonClick = (targetUserId: string) => {
    createPrivateChat(targetUserId);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!newMessage) return;

    const currentUserId = currentUser?.uid;

    if (currentUserId && room) {
      const messagesRef = collection(db, "chats", room, "messages");

      await addDoc(messagesRef, {
        senderId: currentUserId,
        content: newMessage,
        timestamp: serverTimestamp(),
      });

      setNewMessage("");
    }
  };

  return (
    <div className="flex m-24 p-12 border-2 rounded-xl min-h-96 space-x-5">
      <div className="room space-y-2 w-1/3 ">
        <div className="flex space-x-4">
          <Input placeholder="Room here ..." ref={roomInputRef} />
          <Button type="submit" onClick={handleEnterChat}>
            Enter Chat
          </Button>
        </div>
        <div className="font-bold text-xl space-x-4 coll">
          <Button
            type="submit"
            onClick={() => handleUserButtonClick("Jx9eUrVXqAXSGvUQ2eRHqSgDkpl2")}
          >
            Alfan2
          </Button>
          <Button
            type="submit"
            onClick={() => handleUserButtonClick("5MWbqmNUVCRpDKaqCC7wKkRZVG83")}
          >
            Rifa
          </Button>
          {/* Add more buttons for other users as needed */}
        </div>
      </div>
      <span className="border-r-2"></span>
      <div className="chat-app w-full ">
        <div className="header px-4 py-2 bg-black rounded text-white">
          <h1>Welcome to: {room.toUpperCase()}</h1>
        </div>
        <div
          ref={messagesContainerRef}
          className="messages p-2 h-96 overflow-y-auto no-scrollbar"
        >
          {messages.map((message) => (
            <div
              className={`message flex mb-2 text-white ${
                currentUser?.uid === message.senderId ? "justify-end" : ""
              }`}
              key={message.id}
            >
              <div className="bg-black px-3 py-1 rounded-xl">
                {message.content}
              </div>
            </div>
          ))}
        </div>
        <form
          onSubmit={handleSubmit}
          className="new-message-form flex space-x-4 items-end"
        >
          <Input
            className="new-message-input"
            placeholder="Type your message here.."
            onChange={(e) => setNewMessage(e.target.value)}
            value={newMessage}
          />
          <Button type="submit" className="send-button">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
