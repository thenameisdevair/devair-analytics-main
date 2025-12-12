// src/app/AnalyticsClientPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { sdk } from "@farcaster/miniapp-sdk";

import { AppShell } from "../components/layout/AppShell";
import { OverviewSection } from "../components/sections/OverviewSection";
import { ContentSection } from "../components/sections/ContentSection";

import type { UserOverview } from "../lib/neynar/userOverview";
import type { CastWithMetrics } from "../lib/neynar/userCasts";

type TabId = "overview" | "content";

interface AnalyticsClientPageProps {
  user: UserOverview;
  initialCasts?: CastWithMetrics[];
}

export function AnalyticsClientPage({
  user,
  initialCasts,
}: AnalyticsClientPageProps) {
  const [activeTab, setActiveTab] = useState<TabId>("overview");

  // Always fall back to [] so casts.length is safe
  const [casts] = useState<CastWithMetrics[]>(initialCasts ?? []);

  const router = useRouter();
  const searchParams = useSearchParams();

  // 🔥 Auto-detect viewer FID when running as a Farcaster mini app
  useEffect(() => {
    // We only need this in the mini app — but calling it in browser is harmless
    // because any failure is caught and we just do nothing.
    (async () => {
      try {
        // Use the mini app SDK to call our backend route
        // This should match the Quick Auth / whoami route you wired on the backend:
        //   /src/app/api/miniapp/whoami/route.ts
        const res = await sdk.actions.fetch("/api/miniapp/whoami", {
          method: "GET",
        });

        if (!res || !res.ok) {
          console.warn(
            "[AnalyticsClientPage] /api/miniapp/whoami not ok:",
            res && res.status
          );
          return;
        }

        const data = await res.json().catch(() => null);
        if (!data) return;

        const viewerFid =
          typeof data.fid === "number"
            ? data.fid
            : typeof data.viewer?.fid === "number"
            ? data.viewer.fid
            : null;

        if (!viewerFid) {
          console.warn(
            "[AnalyticsClientPage] whoami response has no numeric fid",
            data
          );
          return;
        }

        // If we’re already showing this FID, do nothing
        if (viewerFid === user.fid) {
          return;
        }

        // Build a new query string:
        // - remove username (to avoid conflict)
        // - set fid=<viewerFid>
        const current = new URLSearchParams(searchParams?.toString() ?? "");
        current.delete("username");
        current.set("fid", String(viewerFid));

        const qs = current.toString();
        const target = qs.length > 0 ? `/?${qs}` : "/";

        console.log(
          "[AnalyticsClientPage] Redirecting to viewer fid:",
          viewerFid,
          "→",
          target
        );

        // This will cause the server component page.tsx to re-run
        // and load the correct user + casts for that fid.
        router.replace(target);
      } catch (err) {
        // Very common when **not** inside Farcaster mini app — that’s fine.
        console.warn(
          "[AnalyticsClientPage] mini app whoami failed (likely not in mini app):",
          err
        );
      }
    })();
    // Only re-run if the currently rendered user changes,
    // so we don't bounce in a loop.
  }, [user.fid, router, searchParams]);

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
