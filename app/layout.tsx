import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ConvexClientProvider } from "@/components/ConvexClientProvider";
import Header from "@/components/Header";
import SyncUserWithConvex from "@/components/SyncUserWithConvex";
import { Toaster } from "sonner";
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],

});

export const metadata: Metadata = {
  title: "Ticket Marketplace",
  description: "A seamless platform to buy and sell event tickets with ease.",
  icons:[
    {
    media:"(prefers-color-scheme:light)",
    url:'/favicon-16x16.png',
    href:'/favicon-16x16.png',
  },
  {
    media:"(prefers-color-scheme:dark)",
    url:'/favicon-16x16.png',
    href:'/favicon-16x16.png',
  },

]
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png"/>
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png"/>
        <link rel="manifest" href="/site.webmanifest"></link>
        <ConvexClientProvider>
          <ClerkProvider>
            <Header/>
            <SyncUserWithConvex/>
            {children}
            <Toaster richColors/>
          </ClerkProvider>
        </ConvexClientProvider>
      </body>
    </html>
  );
}
