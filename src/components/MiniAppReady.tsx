"use client";

import { useEffect } from "react";

/**
 * This component:
 * 1. Injects the Farcaster Mini App SDK script into the page
 * 2. Calls sdk.actions.ready() once it's loaded
 *
 * Farcaster is specifically looking for sdk.actions.ready()
 * or it will keep showing the "Ready not called" warning.
 */
export function MiniAppReady() {
  useEffect(() => {
    const scriptId = "farcaster-miniapps-sdk";

    function callReady() {
      try {
        const w = window as any;
        if (w.sdk && w.sdk.actions && typeof w.sdk.actions.ready === "function") {
          w.sdk.actions.ready();
          // Optional: log for your own debugging
          console.log("[MiniApp] sdk.actions.ready() called ✅");
        } else {
          console.log("[MiniApp] sdk not available yet");
        }
      } catch (e) {
        console.error("[MiniApp] Error calling sdk.actions.ready()", e);
      }
    }

    // If SDK script already exists, just call ready
    if (document.getElementById(scriptId)) {
      callReady();
      return;
    }

    // Otherwise inject the script, then call ready() on load
    const s = document.createElement("script");
    s.id = scriptId;
    s.src = "https://miniapps.farcaster.xyz/sdk/v1"; // SDK URL from docs
    s.async = true;
    s.onload = () => {
      console.log("[MiniApp] Farcaster SDK loaded");
      callReady();
    };
    s.onerror = (err) => {
      console.error("[MiniApp] Failed to load Farcaster SDK", err);
    };

    document.head.appendChild(s);

    // no cleanup needed; script can stay for the session
  }, []);

  // Nothing visual – it just does the handshake
  return null;
}
