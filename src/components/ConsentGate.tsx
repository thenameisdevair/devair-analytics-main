"use client";

import { useEffect, useState } from "react";

type ConsentGateProps = {
  children: React.ReactNode;
  fid: number | null;
};

export function ConsentGate({ children, fid }: ConsentGateProps) {
  const [accepted, setAccepted] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== "undefined") {
      const stored = window.localStorage.getItem("fa_consent_v1");
      if (stored === "yes") {
        setAccepted(true);
      }
    }
  }, []);

  const handleAccept = () => {
    if (typeof window !== "undefined") {
      window.localStorage.setItem("fa_consent_v1", "yes");
    }
    setAccepted(true);
  };

  // avoid hydration mismatch
  if (!mounted) return null;

  if (!accepted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-4">
        <div className="max-w-md w-full rounded-xl border border-purple-400/40 bg-neutral-950/90 p-6 text-sm text-neutral-100 space-y-4">
          <h1 className="text-lg font-semibold">Permission needed</h1>

          <p>
            This mini app uses your Farcaster <code>fid</code> to fetch your{" "}
            <strong>public</strong> profile and cast statistics from Neynar.
            No private keys, passwords, or DMs are accessed.
          </p>

          {fid && (
            <p className="text-xs text-neutral-400">
              Detected fid: <span className="font-mono">{fid}</span>
            </p>
          )}

          <p className="text-xs text-neutral-400">
            By tapping <strong>Launch analytics</strong>, you agree that this app may
            request your public Farcaster data via Neynar&apos;s API to show you
            analytics about your account.
          </p>

          <button
            onClick={handleAccept}
            className="w-full rounded-lg bg-purple-500 py-2 text-sm font-medium hover:bg-purple-400"
          >
            Launch analytics
          </button>
        </div>
      </main>
    );
  }

  return <>{children}</>;
}
