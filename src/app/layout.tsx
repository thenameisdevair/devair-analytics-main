// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { FarcasterReady } from "../components/FarcasterReady";

export const metadata: Metadata = {
  title: "Devair Analytics",
  description: "Farcaster analytics mini app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* This tells the Farcaster client “my UI is ready, hide the splash” */}
        <FarcasterReady />

        {children}
      </body>
    </html>
  );
}
