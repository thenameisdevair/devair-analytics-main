// src/components/FarcasterReady.tsx
"use client";

import { useEffect } from "react";
import { sdk } from "@farcaster/miniapp-sdk";

export function FarcasterReady() {
  useEffect(() => {
    (async () => {
      try {
        // This will only fully work inside the Farcaster mini app container.
        // Outside (normal browser) it may throw, and that's fine – we catch it.
        await sdk.actions.ready();
        console.log("[FarcasterReady] sdk.actions.ready() called");
      } catch (e) {
        console.error("[FarcasterReady] sdk.actions.ready() failed:", e);
      }
    })();
  }, []);

  return null;
}
