"use client";

import { useEffect } from "react";

/**
 * MiniAppReady
 *
 * - Assumes the Farcaster Mini App SDK is loaded via a <Script> tag
 *   at "https://miniapps.farcaster.xyz/sdk/v1".
 * - Checks if we're actually inside a mini app (using sdk.isInMiniApp if available).
 * - Calls sdk.actions.ready() so Farcaster stops showing the "Ready not called" warning.
 *
 * Outside of Farcaster (localhost, normal browser) this just logs and does nothing.
 */
export function MiniAppReady() {
  useEffect(() => {
    const w = window as any;

    function tryCallReady() {
      const sdk = w.sdk;
      if (!sdk) {
        console.log("[MiniApp] sdk not present yet");
        return false;
      }

      // If SDK exposes a helper like isInMiniApp / isMiniApp, use it
      let inMiniApp = true;
      try {
        if (typeof sdk.isInMiniApp === "function") {
          inMiniApp = sdk.isInMiniApp();
        } else if (typeof sdk.isMiniApp === "function") {
          inMiniApp = sdk.isMiniApp();
        }
      } catch (e) {
        console.warn("[MiniApp] error checking isInMiniApp", e);
      }

      if (!inMiniApp) {
        console.log("[MiniApp] Not running inside Farcaster mini app, skipping ready()");
        return true; // we’re “done” for this environment
      }

      if (
        sdk.actions &&
        typeof sdk.actions.ready === "function"
      ) {
        sdk.actions.ready();
        console.log("[MiniApp] sdk.actions.ready() called ✅");
        return true;
      }

      console.log("[MiniApp] sdk.actions.ready not available yet");
      return false;
    }

    // Try immediately
    let done = tryCallReady();

    // Retry a few times in case SDK or context is attached a bit later
    const intervalId = setInterval(() => {
      if (done) {
        clearInterval(intervalId);
        return;
      }
      done = tryCallReady();
      if (done) clearInterval(intervalId);
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return null; // no UI
}
