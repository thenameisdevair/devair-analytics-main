// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import FarcasterReady from "../components/FarcasterReady";
// ⬆ keep any other imports you already had (Providers, fonts, etc.)

export const metadata: Metadata = {
  title: "Farcaster Analytics",
  description: "Track your Farcaster growth and content performance",
  // keep any extra fields you already had
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {/* 👇 This is the only new thing that matters */}
        <FarcasterReady />

        {/* If you use a Providers component, keep it exactly as before */}
        {/* <Providers>{children}</Providers> */}
        {children}
      </body>
    </html>
  );
}
