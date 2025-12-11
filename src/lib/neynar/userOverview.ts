// src/lib/neynar/userOverview.ts
import {
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

// Small helper to normalize Neynar's user object → our shape
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
 */
export async function getUserOverviewByFid(
  fid: number
): Promise<UserOverview> {
  const data = await getUserProfileByFid(fid);
  // Neynar returns { user: { ... } } here as well
  return mapNeynarUserToOverview(data.user);
}
