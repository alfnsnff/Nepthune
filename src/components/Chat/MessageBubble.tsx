import { auth } from "@/lib/firebase-config";
import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";

interface MessageProps {
  message: {
    id: string;
    senderId: string;
    text: string;
  };
}

const Message: React.FC<MessageProps> = ({ message }) => {
  const { currentUser } = useContext(AuthContext);
  const { data } = useContext(ChatContext);

  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  }, [message]);

  const isLink = (text: string) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    return urlRegex.test(text);
  };

  const renderMessageContent = (text: string) => {
    if (isLink(text)) {
      return (
        // <a
        //   href={text}
        //   target="_blank"
        //   rel="noopener noreferrer"
        //   className={`flex leading-1.5 p-2 items-end text-slate-800 dark:bg-gray-700 drop-shadow-sm ${
        //     message.senderId === currentUser?.uid && "owner"
        //       ? "rounded-s-xl rounded-ee-xl bg-green-400"
        //       : "rounded-e-xl rounded-es-xl bg-white"
        //   }`}
        // >
        //   {text}
        // </a>
        <div
          className={`flex leading-1.5 p-2 items-end text-slate-800 dark:bg-gray-700 drop-shadow-sm ${
            message.senderId === currentUser?.uid && "owner"
              ? "rounded-s-xl rounded-ee-xl bg-green-400"
              : "rounded-e-xl rounded-es-xl bg-white"
          }`}
        >
          <a href={text} target="_blank" rel="noopener noreferrer" className="text-blue-600">
            {text}
          </a>
        </div>
      );
    } else {
      return (
        <div
          className={`flex leading-1.5 p-2 items-end text-slate-800 dark:bg-gray-700 drop-shadow-sm ${
            message.senderId === currentUser?.uid && "owner"
              ? "rounded-s-xl rounded-ee-xl bg-green-400"
              : "rounded-e-xl rounded-es-xl bg-white"
          }`}
        >
          <p>{text}</p>
        </div>
      );
    }
  };

  return (
    <div
      ref={ref}
      className={`flex gap-2 ${
        message.senderId === currentUser?.uid && "owner"
          ? "flex-row-reverse"
          : ""
      }`}
    >
      <img
        className="size-10 rounded-full"
        src={
          message.senderId === currentUser?.uid
            ? currentUser?.photoURL || ""
            : data.user?.photoURL || ""
        }
        alt=""
      />
      {renderMessageContent(message.text)}
    </div>
  );
};

export default Message;
