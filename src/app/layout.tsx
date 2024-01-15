"use client";

import "../styles/prism-vsc-dark-plus.css";
import { Inter } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import { SessionProvider } from "next-auth/react";
import { ThemeProvider } from "next-themes";
import { ChatContextProvider } from "@/context/ChatContext";

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
          <ThemeProvider>
            <SessionProvider>
              <ChatContextProvider>
                <Header />
                {children}
              </ChatContextProvider>
            </SessionProvider>
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
