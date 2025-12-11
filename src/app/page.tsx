// src/app/page.tsx

// 🔁 Always dynamic: do NOT bake devair-md at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

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

// 👇 In *your* Next version, `searchParams` is a Promise in server components
type SearchParamsShape = {
  username?: string;
  fid?: string;
};

type PageProps = {
  searchParams?: Promise<SearchParamsShape>;
};

export default async function Page(props: PageProps) {
  // 🔑 This is the important part:
  // Unwrap the Promise-based searchParams from Next
  const resolved = (await props.searchParams) || {};
  const usernameParam = resolved.username;
  const fidParam = resolved.fid;

  const defaultUsername = "devair-md";

  try {
    // 1) Decide how to load the user
    //    Priority: fid (mini-app) → username → default
    let baseUser;

    if (fidParam && fidParam.trim().length > 0) {
      const fidNum = Number(fidParam);
      if (!fidNum || Number.isNaN(fidNum)) {
        throw new Error(`Invalid fid query param: ${fidParam}`);
      }
      baseUser = await getUserOverviewByFid(fidNum);
    } else {
      const username =
        usernameParam && usernameParam.trim().length > 0
          ? usernameParam.trim()
          : defaultUsername;

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
            Check your <code>NEYNAR_API_KEY</code> and network, then refresh.
            <br />
            You can also test with{" "}
            <code>?username=somehandle</code> or <code>?fid=123</code>.
          </p>
        </div>
      </main>
    );
  }
}
