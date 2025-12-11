import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { MiniAppReady } from "../components/MiniAppReady";

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
      <head>
        {/* Load Farcaster Mini Apps SDK once, for the whole app */}
        <Script
          src="https://miniapps.farcaster.xyz/sdk/v1"
          strategy="afterInteractive"
        />
      </head>
      <body className="bg-neutral-950 text-neutral-50">
        {/* This will call sdk.actions.ready() when appropriate */}
        <MiniAppReady />
        {children}
      </body>
    </html>
  );
}
