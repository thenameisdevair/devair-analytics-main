// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { MiniAppReady } from "../components/MiniAppReady";

export const metadata: Metadata = {
  title: "Farcaster Analytics",
  description: "Analytics for your Farcaster account",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* This will call sdk.actions.ready() when loaded inside a mini app */}
        <MiniAppReady />
        {children}
      </body>
    </html>
  );
}
