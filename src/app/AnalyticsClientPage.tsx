// src/app/AnalyticsClientPage.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

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

  // Always fall back to [] so `casts.length` is safe
  const [casts] = useState<CastWithMetrics[]>(initialCasts ?? []);

  const router = useRouter();
  const searchParams = useSearchParams();

  /**
   * 🔥 Mini-app auto-FID logic
   *
   * When running inside Farcaster, any `fetch("/api/miniapp/whoami")`
   * will include the signed mini-app context. Your backend can decode that
   * (Quick Auth) and return { fid, username, ... }.
   *
   * Here we:
   * - call /api/miniapp/whoami
   * - if it returns a numeric fid different from user.fid,
   *   we redirect to /?fid=<viewerFid> so page.tsx reloads analytics
   *   for the actual viewer.
   *
   * In a normal browser (not in Farcaster), this route will usually return
   * 4xx/5xx → we catch it and do nothing. Manual ?username= / ?fid= still work.
   */
  useEffect(() => {
    (async () => {
      try {
        // Just a safety check, though in "use client" this should always be defined
        if (typeof window === "undefined") return;

        const res = await fetch("/api/miniapp/whoami", {
          method: "GET",
        });

        if (!res.ok) {
          console.warn(
            "[AnalyticsClientPage] /api/miniapp/whoami not ok:",
            res.status,
            res.statusText
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

        // Already showing this FID → no redirect
        if (viewerFid === user.fid) {
          return;
        }

        // Build new query string: remove username, set fid=<viewerFid>
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

        router.replace(target);
      } catch (err) {
        // Very common when not inside Farcaster mini app or when whoami is not wired yet
        console.warn(
          "[AnalyticsClientPage] mini-app whoami fetch failed (likely not in mini app):",
          err
        );
      }
    })();
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
