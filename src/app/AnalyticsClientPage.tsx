"use client";

import { useState } from "react";
import { AppShell } from "../components/layout/AppShell";
import { OverviewSection } from "../components/sections/OverviewSection";
import { ContentSection } from "../components/sections/ContentSection";
import type { UserOverview } from "../lib/neynar/userOverview";
import type { CastWithMetrics } from "../lib/neynar/userCasts";

type TabId = "overview" | "content";

interface AnalyticsClientPageProps {
  user: UserOverview;
  initialCasts?: CastWithMetrics[]; // <- make optional
}

export function AnalyticsClientPage({ user, initialCasts }: AnalyticsClientPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Always fall back to [] so `casts.length` is safe
  const [casts] = useState<CastWithMetrics[]>(initialCasts ?? []);

  const overviewUser = {
    followerCount: user.followerCount,
    verifiedFollowerCount: user.verifiedFollowerCount,
    totalCasts: casts.length,
  };

  return (
    <AppShell
      user={{
        username: user.username,
        displayName: user.displayName,
        avatarUrl: user.avatarUrl,
        followerCount: user.followerCount,
        verifiedFollowerCount: user.verifiedFollowerCount,
      }}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === "overview" && (
        <OverviewSection user={overviewUser} casts={casts} />
      )}

      {activeTab === "content" && (
        <ContentSection casts={casts} followerCount={user.followerCount} />
      )}
    </AppShell>
  );
}
