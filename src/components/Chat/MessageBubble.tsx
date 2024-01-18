import { auth } from "@/lib/firebase-config";
import React, { useContext, useEffect, useRef } from "react";
import { ChatContext } from "@/context/ChatContext";
import { AuthContext } from "@/context/AuthContext";

interface MessageProps {
  message: {
    date: any;
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
    const extractLink = (text: string) => {
      // Use a regular expression to find the link in the text
      const linkRegex = /(https?:\/\/[^\s]+)/;
      const match = text.match(linkRegex);
      return match ? match[0] : null;
    };
  
    const isLink = (text: string) => {
      return extractLink(text) !== null;
    };
  
    const renderCombinedMessage = (plainText: string, link: string) => (
      <p className="text-wrap break-all">
        {plainText.slice(0, plainText.indexOf(link))}
        <a
          href={link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sky-500 text-wrap break-words"
        >
          {link}
        </a>
        {plainText.slice(plainText.indexOf(link) + link.length)}
      </p>
    );
  
    const renderText = (plainText: string) => (
      <p className="text-wrap break-all">{plainText}</p>
    );
  
    const link = extractLink(text);
  
    return (
      <div
        className={`flex max-w-[320px] leading-1.5 p-2.5 items-end text-slate-800 dark:bg-gray-700 drop-shadow-sm ${
          message.senderId === currentUser?.uid && "owner"
            ? "rounded-s-xl rounded-ee-xl bg-green-300"
            : "rounded-e-xl rounded-es-xl bg-white"
        }`}
      >
        {isLink(text) ? renderCombinedMessage(text, link!) : renderText(text)}
        <span className="pl-2 text-nowrap text-xs/[1px] font-normal text-gray-500 dark:text-gray-400">
          {new Date(message.date.toDate()).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
    );
  };
  
  
  

  const renderMessageContents = (text: string) => {
    if (isLink(text)) {
      return (
        <div
          className={`flex max-w-[320px] leading-1.5 p-2.5 items-end text-slate-800 dark:bg-gray-700 drop-shadow-sm ${
            message.senderId === currentUser?.uid && "owner"
              ? "rounded-s-xl rounded-ee-xl bg-green-400"
              : "rounded-e-xl rounded-es-xl bg-white"
          }`}
        >
          <a
            href={text}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sky-500 text-wrap break-words"
          >
            {text}
          </a>
            <span className="pl-2 text-nowrap text-xs/[1px] font-normal text-gray-500 dark:text-gray-400">
            {new Date(message.date.toDate()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      );
    } else {
      return (
        <div
          className={`flex max-w-[320px] leading-1.5 p-2.5 items-end text-slate-800 dark:bg-gray-700 drop-shadow-sm ${
            message.senderId === currentUser?.uid && "owner"
              ? "rounded-s-xl rounded-ee-xl bg-green-400"
              : "rounded-e-xl rounded-es-xl bg-white"
          }`}
        >
          <p className="text-wrap break-all">{text}</p>
          <span className="pl-2 text-nowrap text-xs/[1px] font-normal text-gray-500 dark:text-gray-400">
            {new Date(message.date.toDate()).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
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
