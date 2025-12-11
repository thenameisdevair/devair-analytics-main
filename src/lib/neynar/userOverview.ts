// src/lib/neynar/userOverview.ts
import {
  neynarFetch,
  getUserProfileByUsername,
  getUserProfileByFid,
} from "./client";

export type UserOverview = {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  followerCount: number;
  verifiedFollowerCount: number;
};

// Normalize Neynar user → our shape
function mapNeynarUserToOverview(rawUser: any): UserOverview {
  const user = rawUser ?? {};

  return {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name ?? user.username,
    avatarUrl: user.pfp_url ?? undefined,
    followerCount: user.follower_count ?? 0,
    // we keep this at 0 here – the real value is injected later
    verifiedFollowerCount: 0,
  };
}

/**
 * Username-based overview (used for manual ?username=… mode
 * and as a default when no fid is passed).
 */
export async function getUserOverviewByUsername(
  username: string
): Promise<UserOverview> {
  const data = await getUserProfileByUsername(username);
  // Neynar returns { user: { ... } }
  return mapNeynarUserToOverview(data.user);
}

/**
 * Fid-based overview (used for mini-app mode: ?fid=...)
 * Strategy:
 *  1. Try official /v2/farcaster/user?fid=...
 *  2. If that fails, fall back to /v2/farcaster/feed with fids=...
 *     and infer the user from the first cast's author.
 */
export async function getUserOverviewByFid(
  fid: number
): Promise<UserOverview> {
  // First, try the direct user-by-fid endpoint
  try {
    const data = await getUserProfileByFid(fid);
    return mapNeynarUserToOverview(data.user);
  } catch (err) {
    console.warn(
      `[userOverview] getUserProfileByFid(${fid}) failed, falling back via feed`,
      err
    );
  }

  // Fallback: use the feed to get at least the author's basic profile
  const feed = (await neynarFetch(
    `/farcaster/feed?feed_type=filter&filter_type=fids&fids=${encodeURIComponent(
      String(fid)
    )}&with_recasts=false&limit=1`
  )) as any;

  const rawCasts: any[] =
    (Array.isArray(feed.casts) && feed.casts) ||
    (Array.isArray(feed.result?.casts) && feed.result.casts) ||
    [];

  if (!rawCasts.length) {
    throw new Error(
      `[userOverview] No casts found to infer user for fid ${fid}`
    );
  }

  const author = rawCasts[0]?.author;
  if (!author) {
    throw new Error(
      `[userOverview] First cast has no author field for fid ${fid}`
    );
  }

  // author usually has { fid, username, display_name, pfp_url, ... }
  return mapNeynarUserToOverview(author);
}
