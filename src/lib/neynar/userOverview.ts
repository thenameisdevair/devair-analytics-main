// src/lib/neynar/userOverview.ts
import { getUserProfileByUsername } from "./client";

export type UserOverview = {
  fid: number;
  username: string;
  displayName: string;
  avatarUrl?: string;
  followerCount: number;
  verifiedFollowerCount: number;
};

export async function getUserOverview(
  username: string
): Promise<UserOverview> {
  const data = await getUserProfileByUsername(username);

  // Neynar can return either { user: {...} } or { result: { user: {...} } }
  const user =
    (data as any).user ??
    (data as any).result?.user ??
    null;

  if (!user) {
    throw new Error(
      `[neynar] getUserOverview: no user found in response for username "${username}"`
    );
  }

  return {
    fid: user.fid,
    username: user.username,
    displayName: user.display_name ?? user.username,
    avatarUrl: user.pfp_url ?? undefined,
    followerCount: user.follower_count ?? 0,
    // still 0 for now; filled later by getVerifiedFollowerCount
    verifiedFollowerCount: 0,
  };
}
