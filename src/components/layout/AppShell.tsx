// src/components/layout/AppShell.tsx
"use client";

import { useEffect } from "react";
import { sdk, isMiniApp } from "@farcaster/miniapp-sdk";

type AppShellProps = {
  user: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    followerCount: number;
    verifiedFollowerCount: number;
  };
  activeTab: "overview" | "content";
  onTabChange: (tab: "overview" | "content") => void;
  children: React.ReactNode;
};

export function AppShell({ user, activeTab, onTabChange, children }: AppShellProps) {
  // 🔑 Tell Warpcast “my UI is ready, hide the splash”
  useEffect(() => {
    async function markReady() {
      try {
        // Only call this when actually running as a mini app
        if (await isMiniApp()) {
          await sdk.actions.ready();
        }
      } catch (err) {
        console.error("[miniapp] failed to call sdk.actions.ready()", err);
      }
    }

    // Only run in browser
    if (typeof window !== "undefined") {
      markReady();
    }
  }, []);

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      {/* your existing header / layout / tabs go here */}
      {/* e.g.: */}
      <header className="border-b border-white/5 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {user.avatarUrl && (
            <img
              src={user.avatarUrl}
              alt={user.displayName}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <div className="text-sm text-white/60">Farcaster analytics for</div>
            <div className="font-semibold">
              {user.displayName} <span className="text-white/60">@{user.username}</span>
            </div>
          </div>
        </div>

        {/* Tab buttons, etc. */}
        <div className="flex gap-2">
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              activeTab === "overview" ? "bg-violet-600" : "bg-white/5"
            }`}
            onClick={() => onTabChange("overview")}
          >
            Overview
          </button>
          <button
            className={`px-3 py-1 rounded-full text-xs ${
              activeTab === "content" ? "bg-violet-600" : "bg-white/5"
            }`}
            onClick={() => onTabChange("content")}
          >
            Content
          </button>
        </div>
      </header>

      <main className="px-4 py-6">{children}</main>
    </div>
  );
}
