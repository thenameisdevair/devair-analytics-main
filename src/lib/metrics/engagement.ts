// src/lib/metrics/engagement.ts
import type { CastWithMetrics } from "../neynar/userCasts";

export type EngagementTotals = {
  totalLikes: number;
  totalRecasts: number;
  totalReplies: number;
  totalEngagement: number;
  avgEngagementPerCast: number;
  engagementRatePerFollower: number; // in %
};

/**
 * X-style engagement (simplified):
 * engagement = likes + recasts + replies
 * engagement rate ≈ engagement / followers * 100
 * (we'll switch to impressions when we can access them)
 */
export function computeEngagementTotals(
  casts: CastWithMetrics[],
  followerCount: number
): EngagementTotals {
  let totalLikes = 0;
  let totalRecasts = 0;
  let totalReplies = 0;

  for (const cast of casts) {
    totalLikes += cast.likes ?? 0;
    totalRecasts += cast.recasts ?? 0;
    totalReplies += cast.replies ?? 0;
  }

  const totalEngagement = totalLikes + totalRecasts + totalReplies;
  const avgEngagementPerCast =
    casts.length > 0 ? totalEngagement / casts.length : 0;

  const engagementRatePerFollower =
    followerCount > 0 ? (totalEngagement / followerCount) * 100 : 0;

  return {
    totalLikes,
    totalRecasts,
    totalReplies,
    totalEngagement,
    avgEngagementPerCast,
    engagementRatePerFollower,
  };
}
/**
 * Engagement + rate for a single cast.
 */
export function computeCastEngagement(
  cast: CastWithMetrics,
  followerCount: number
) {
  const likes = cast.likes ?? 0;
  const recasts = cast.recasts ?? 0;
  const replies = cast.replies ?? 0;

  const total = likes + recasts + replies;
  const rate =
    followerCount > 0 ? (total / followerCount) * 100 : 0;

  return {
    total,
    rate, // %
    likes,
    recasts,
    replies,
  };
}
