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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

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
          <div className="h-[540px] mt-24 flex flex-col sm:flex-row sm:mt-24 sm:mx-16 sm:border sm:drop-shadow">
            {/* Chat List Section (Hidden on Mobile) */}
            <div
              className="flex-col overflow-y-auto no-scrollbar 
                sm:flex 
                sm:w-2/5
                sm:bg-white 
                sm:drop-shadow
                hidden" // Hide on mobile
            >
              <h1 className="font-bold border-b border-slate-200 sm:px-4 sm:py-4 sm:sticky sm:top-0 ">
                Your Chats
              </h1>
              <Chats />
            </div>
            {/* Chat List Section (Mobile View) */}
            <div
              className="flex-col 
                sm:hidden
                bg-white 
                drop-shadow
                w-full" // Show on mobile
            >
              <Collapsible>
                <CollapsibleTrigger>
                  <h1 className="font-bold bg-white border-b border-slate-200 px-4 py-4 sticky top-0">
                    Click Here To Select Chat
                  </h1>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <Chats />
                </CollapsibleContent>
              </Collapsible>
            </div>
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
                  {/* Chat Window Section (Mobile View) */}
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
