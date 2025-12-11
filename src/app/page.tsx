// src/app/page.tsx
import { AnalyticsClientPage } from "./AnalyticsClientPage";
import { getUserOverview } from "../lib/neynar/userOverview";
import {
  getUserCastsWithMetrics,
  type CastWithMetrics,
} from "../lib/neynar/userCasts";
import { getVerifiedFollowerCount } from "../lib/neynar/verifiedFollowers";

type SearchParamsPromise = Promise<{
  username?: string;
} | undefined>;

export default async function Page({
  searchParams,
}: {
  searchParams: SearchParamsPromise;
}) {
  // ✅ Correct way for Next 15+ (searchParams is a Promise)
  const resolved = (await searchParams) || {};
  const username = resolved.username || "devair-md";

  try {
    // 1) Basic profile from Neynar
    const baseUser = await getUserOverview(username);

    // 2) Verified followers – best effort
    let verifiedFollowerCount = 0;
    try {
      verifiedFollowerCount = await getVerifiedFollowerCount(baseUser.fid);
    } catch (err) {
      console.warn("[page] getVerifiedFollowerCount failed, using 0", err);
    }

    const user = {
      ...baseUser,
      verifiedFollowerCount,
    };

    // 3) Casts with metrics – best effort (if it fails, we still render the page)
    let casts: CastWithMetrics[] = [];
    try {
      casts = await getUserCastsWithMetrics(user.fid);
    } catch (err) {
      console.warn("[page] getUserCastsWithMetrics failed, using []", err);
    }

    return <AnalyticsClientPage user={user} initialCasts={casts} />;
  } catch (err) {
    console.error("[page] Fatal Neynar error", err);

    // Hard fail: show a clear error instead of fake demo data
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-950 text-slate-50">
        <div className="p-6 rounded-lg border border-red-500/40 bg-red-500/5 max-w-md text-center">
          <h1 className="text-lg font-semibold text-red-400">
            Failed to load data from Neynar
          </h1>
          <p className="text-sm mt-2 text-slate-300">
            Check your <code>NEYNAR_API_KEY</code> in <code>.env.local</code> and
            your network connection, then refresh this page.
          </p>
        </div>
      </main>
    );
  }
}
