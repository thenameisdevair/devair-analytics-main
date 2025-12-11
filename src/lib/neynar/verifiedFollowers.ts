// src/lib/neynar/verifiedFollowers.ts
import { neynarFetch } from "./client";

/**
 * First version:
 * - Fetch a slice of followers for this fid from /v2/farcaster/followers
 * - Count how many look "verified" / "power" users.
 *
 * Later you can:
 * - Add pagination
 * - Refine what "verified" means.
 */
export async function getVerifiedFollowerCount(fid: number): Promise<number> {
  if (!fid) return 0;

  const data = await neynarFetch(
    `/farcaster/followers?fid=${encodeURIComponent(String(fid))}&limit=50`
  );

  // HTTP response format from docs / SDK examples:
  // { result: { users: [...], next: { cursor: "..." } } }
  const followers: any[] =
    (data as any).result?.users ??
    (data as any).users ??
    [];

  if (!Array.isArray(followers) || followers.length === 0) {
    return 0;
  }

  let verifiedCount = 0;

  for (const u of followers) {
    const powerBadge = u.power_badge === true;
    const hasVerifications =
      Array.isArray(u.verifications) && u.verifications.length > 0;

    if (powerBadge || hasVerifications) {
      verifiedCount += 1;
    }
  }

  return verifiedCount;
}
