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
          <div className="h-[520px] mt-24 flex m-16 border drop-shadow">
            <div className="w-2/5 overflow-y-auto no-scrollbar">
              <div className="sticky top-0 px-4 py-4 bg-white drop-shadow">
                <h1>Your Chats</h1>
              </div>
              <Search />
              <Separator />
              <Chats />
            </div>
            <span className="border-r-2"></span>

            <div className="w-full bg-gray-50 h-full flex flex-col justify-between">
              {!data.chatId ? (
                <div className="flex flex-col h-full justify-center items-center text-slate-800 gap-2">
                  <h1 className="font-bold text-xl">Selamat Datang di Chat</h1>
                  <h1 className="text-slate-600">
                    Pilih pesan untuk mulai percakapan
                  </h1>
                </div>
              ) : (
                <>
                  <div className="px-4 py-4 bg-white drop-shadow">
                    {data.user?.displayName}
                  </div>
                  <Messages />
                  <Input />
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
