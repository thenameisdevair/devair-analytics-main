// src/app/page.tsx
import { AnalyticsClientPage } from "./AnalyticsClientPage";

import {
  getUserOverviewByUsername,
  getUserOverviewByFid,
} from "../lib/neynar/userOverview";

import {
  getUserCastsWithMetrics,
  type CastWithMetrics,
} from "../lib/neynar/userCasts";

import { getVerifiedFollowerCount } from "../lib/neynar/verifiedFollowers";

type PageProps = {
  searchParams?: {
    username?: string;
    fid?: string;
  };
};

export default async function Page({ searchParams }: PageProps) {
  const usernameParam = searchParams?.username;
  const fidParam = searchParams?.fid;

  try {
    // 1) Decide how to load the user
    //    Priority: fid (mini-app) → username → default "devair-md"
    let baseUser;

    if (fidParam) {
      const fidNum = Number(fidParam);
      if (!fidNum || Number.isNaN(fidNum)) {
        throw new Error(`Invalid fid query param: ${fidParam}`);
      }
      baseUser = await getUserOverviewByFid(fidNum);
    } else {
      const username = usernameParam && usernameParam.trim().length > 0
        ? usernameParam.trim()
        : "devair-md";
      baseUser = await getUserOverviewByUsername(username);
    }

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

    // 3) Casts with metrics – best effort
    let casts: CastWithMetrics[] = [];
    try {
      casts = await getUserCastsWithMetrics(user.fid);
    } catch (err) {
      console.warn("[page] getUserCastsWithMetrics failed, using []", err);
    }

    return <AnalyticsClientPage user={user} initialCasts={casts} />;
  } catch (err) {
    console.error("[page] Fatal Neynar error", err);

    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="p-6 rounded-lg border border-red-500/40 bg-red-500/5">
          <h1 className="text-lg font-semibold text-red-500">
            Failed to load data from Neynar
          </h1>
          <p className="text-sm mt-2 text-neutral-300">
            Check your <code>NEYNAR_API_KEY</code> in your environment
            (.env.local or Vercel env) and your network connection, then
            refresh the page.
          </p>
        </div>
      </main>
    );
  }
}
