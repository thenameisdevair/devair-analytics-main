// src/components/layout/AppShell.tsx
import type { ReactNode } from "react";

type TabId = "overview" | "content";

interface AppShellProps {
  user: {
    username: string;
    displayName: string;
    avatarUrl?: string;
    followerCount: number;
    verifiedFollowerCount: number;
  };
  activeTab: TabId;
  onTabChange: (tab: TabId) => void;
  children: ReactNode;
}

export function AppShell(props: AppShellProps) {
  const { user, activeTab, onTabChange, children } = props;

  return (
    <div className="min-h-screen bg-[#050816] text-[#F9FAFB] flex flex-col">
      {/* Header */}
      <header className="flex items-center gap-3 px-4 py-3 border-b border-[#1F2933] bg-gradient-to-r from-[#050816] via-[#050816] to-[#0B1020]">
        <div className="w-10 h-10 rounded-full bg-[#111827] overflow-hidden border border-[#1F2933]">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.username}
              className="w-full h-full object-cover"
            />
          ) : null}
        </div>
        <div className="flex flex-col">
          <span className="text-xs text-[#9CA3AF]">Farcaster analytics for</span>
          <span className="font-semibold text-sm">
            {user.displayName} @{user.username}
          </span>
          <span className="text-[11px] text-[#9CA3AF]">
            {user.followerCount.toLocaleString()} followers •{" "}
            {user.verifiedFollowerCount.toLocaleString()} verified
          </span>
        </div>
      </header>

      {/* Tabs */}
      <nav className="flex px-4 pt-3 gap-2 text-xs border-b border-[#1F2933] bg-[#050816]">
        <button
          className={`px-3 py-2 rounded-full transition-colors ${
            activeTab === "overview"
              ? "bg-[#0052FF] text-white shadow-sm"
              : "bg-[#111827] text-[#E5E7EB] hover:bg-[#1F2937]"
          }`}
          onClick={() => onTabChange("overview")}
        >
          Overview
        </button>
        <button
          className={`px-3 py-2 rounded-full transition-colors ${
            activeTab === "content"
              ? "bg-[#0052FF] text-white shadow-sm"
              : "bg-[#111827] text-[#E5E7EB] hover:bg-[#1F2937]"
          }`}
          onClick={() => onTabChange("content")}
        >
          Content
        </button>
      </nav>

      {/* Content */}
      <main className="flex-1 overflow-y-auto px-4 py-3 bg-[#050816]">
        {children}
      </main>
    </div>
  );
}
