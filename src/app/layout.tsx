// src/app/layout.tsx
import type { ReactNode } from "react";
import "./globals.css";
import { MiniAppReady } from "../components/MiniAppReady";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body>
        {/* This runs once on mount in the browser and calls actions.ready() */}
        <MiniAppReady />

        {children}
      </body>
    </html>
  );
}
