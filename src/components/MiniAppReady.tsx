"use client";

import { useEffect } from "react";

// Tell TypeScript about the global mini-app client, so it doesn't complain.
// You will need to adjust this shape based on the docs.
declare global {
  interface Window {
    // 🔴 CHANGE THIS to match the actual global from the docs
    FarcasterMiniApp?: {
      actions?: {
        ready: () => void;
      };
    };
  }
}

export function MiniAppReady() {
  useEffect(() => {
    try {
      // Only run in the browser
      if (typeof window === "undefined") return;

      // 🔴 If the docs use a *different* global name,
      // update this line accordingly.
      const client = window.FarcasterMiniApp;

      if (client?.actions?.ready) {
        client.actions.ready();
        console.log("[mini-app] actions.ready() called");
      } else {
        console.log(
          "[mini-app] Mini app client not found – probably running in normal browser, or SDK not injected."
        );
      }
    } catch (err) {
      console.error("[mini-app] Failed to call actions.ready()", err);
    }
  }, []);

  return null; // no UI
}
