"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { ChatContextProvider } from "@/context/ChatContext";
// import "../styles/prism-vsc-dark-plus.css";
// import { ThemeProvider } from "next-themes";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="!scroll-smooth">
      <body className={inter.className}>
        <SessionProvider>
          {/* <ThemeProvider> */}
            <ChatContextProvider>
              <Header />
              {children}
            </ChatContextProvider>
          {/* </ThemeProvider> */}
        </SessionProvider>
      </body>
    </html>
  );
}
