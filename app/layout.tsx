import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import Header from "@/components/header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "NLP Chatbot",
  description:
    "Chatbot razvijen za potrebe predmeta OPJ (NLP) na FER-u u Zagrebu",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <main className="flex flex-col gap-4 min-h-screen">
          <Header className="mx-auto font-mono flex-grow-0" />
          {children}
          <Toaster richColors position="top-center" />
        </main>
      </body>
    </html>
  );
}
