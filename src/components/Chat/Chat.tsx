"use client";
import Signin from "@/components/Auth/SignIn";
import Search from "@/components/Chat/SearchUser";
import Chats from "@/components/Chat/ChatLists";
import Messages from "@/components/Chat/Messages";
import Input from "@/components/Chat/InputForm";
import { ChatContext } from "@/context/ChatContext";
import React, { useContext } from "react";
import { auth } from "@/lib/firebase-config";
import { Separator } from "@/components/ui/separator";

const Chat = () => {
  const { data } = useContext(ChatContext);
  return (
    <>
      {!auth ? (
        <>
          {/* <Breadcrumb pageName="Discuss" /> */}
          <Signin />
        </>
      ) : (
        <>
          <div className="h-[520px] mt-24 m-16 flex flex-col sm:flex-row sm:border sm:drop-shadow">
            {/* Chat List Section (Hidden on Mobile) */}
            <div
              className="hidden flex-col overflow-y-auto no-scrollbar 
                sm:flex 
                sm:w-2/5
                
              sm:bg-white 
                sm:drop-shadow"
            >
              <h1 className="font-bold border-b border-slate-200 sm:px-4 sm:py-4 sm:sticky sm:top-0 ">
                Your Chats
              </h1>
              <Chats />
            </div>

            {/* Vertical Separator */}
            {/* <span className="sm:border-r-2"></span> */}

            {/* Chat Messages Section */}
            <div className="w-full bg-gray-50 flex flex-col h-full">
              {data.chatId === "null" ? (
                <div className="flex flex-col h-full justify-center items-center border text-slate-800 gap-2 p-4">
                  <h1 className="font-bold text-lg sm:text-xl">
                    Selamat Datang di Chat
                  </h1>
                  <h1 className="text-slate-600">
                    Pilih pesan untuk mulai percakapan
                  </h1>
                </div>
              ) : (
                <>
                  {/* <div className="px-4 py-4 bg-white font-bold">
                    {data.user?.displayName}
                  </div>
                  <div className="flex-1 overflow-y-auto no-scrollbar">
                    <Messages />
                  </div>
                  <Input /> */}
                  <div className="w-full border bg-gray-50 h-full flex flex-col">
                    <div className="px-4 py-4 bg-white border-b">
                      {data.user?.displayName}
                    </div>
                    <Messages />
                    <Input />
                  </div>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default Chat;
