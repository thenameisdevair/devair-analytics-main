import type { Metadata } from "next";
import "./globals.css";
import { MiniAppReady } from "../components/MiniAppReady"; // 👈 add this import

export const metadata: Metadata = {
  title: "Farcaster Analytics",
  description: "Devair Farcaster analytics mini app",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-neutral-950 text-neutral-50">
        {/* 👇 This silently loads the SDK and calls sdk.actions.ready() */}
        <MiniAppReady />
        {children}
      </body>
    </html>
  );
}
