// src/components/FarcasterReady.tsx
"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export default function FarcasterReady() {
  useEffect(() => {
    (async () => {
      try {
        // This tells Warpcast: "my UI is ready, hide the splash"
        await sdk.actions.ready();
      } catch (e) {
        console.error("sdk.actions.ready() failed:", e);
      }
    })();
  }, []);

  // This component only performs a side-effect, it renders nothing
  return null;
}
