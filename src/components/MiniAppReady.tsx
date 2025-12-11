"use client";

import { useEffect } from "react";

/**
 * MiniAppReady
 *
 * In the Farcaster mini app container, the host injects a global `window.sdk`.
 * We just need to call `sdk.actions.ready()` on THAT object.
 *
 * We do NOT load any extra script here. If you inject another SDK bundle,
 * you end up calling ready() on the wrong instance and the host keeps
 * showing "Ready not called".
 */
export function MiniAppReady() {
  useEffect(() => {
    const w = window as any;

    function tryCallReady() {
      const sdk = w.sdk;
      if (sdk && sdk.actions && typeof sdk.actions.ready === "function") {
        sdk.actions.ready();
        console.log("[MiniApp] sdk.actions.ready() called ✅");
        return true;
      }
      console.log("[MiniApp] sdk not present yet");
      return false;
    }

    // Try immediately
    let done = tryCallReady();

    // If not ready yet, keep checking a few times (for safety)
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

  // No UI
  return null;
}
