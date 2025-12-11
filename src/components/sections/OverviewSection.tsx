// src/components/sections/OverviewSection.tsx
import { MetricCard } from "../metrics/MetricCard";
import { computeEngagementTotals } from "../../lib/metrics/engagement";

interface OverviewSectionProps {
  user: {
    followerCount: number;
    verifiedFollowerCount: number;
    totalCasts: number;
  };
  casts: {
    id: string;
    likes: number;
    recasts: number;
    replies: number;
    createdAt: string;
  }[];
}

export function OverviewSection({ user, casts }: OverviewSectionProps) {
  const {
    totalLikes,
    totalRecasts,
    totalReplies,
    totalEngagement,
    avgEngagementPerCast,
    engagementRatePerFollower,
  } = computeEngagementTotals(casts as any, user.followerCount);

  return (
    <div className="flex flex-col gap-3">
      {/* Top: followers + casts */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Followers"
          value={user.followerCount}
          hint="Total Farcaster followers"
        />
        <MetricCard
          label="Verified followers"
          value={user.verifiedFollowerCount}
          hint="Followers with verified accounts"
        />
        <MetricCard
          label="Total casts"
          value={user.totalCasts}
          hint="All-time posts (current window)"
        />
      </div>

      {/* Middle: engagement breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <MetricCard
          label="Likes"
          value={totalLikes}
          hint="All likes across your loaded casts"
        />
        <MetricCard
          label="Recasts"
          value={totalRecasts}
          hint="All recasts across your loaded casts"
        />
        <MetricCard
          label="Replies"
          value={totalReplies}
          hint="All replies across your loaded casts"
        />
      </div>

      {/* Bottom: engagement summary */}
      <div className="grid grid-cols-2 gap-3">
        <MetricCard
          label="Total engagement"
          value={totalEngagement}
          hint="Likes + recasts + replies (current window)"
        />
        <MetricCard
          label="Engagement rate (%)"
          value={engagementRatePerFollower.toFixed(2)}
          hint="Engagement divided by followers (approx, no impressions yet)"
        />
      </div>

      {/* Optional extra: avg per cast */}
      <div className="grid grid-cols-1 gap-3">
        <MetricCard
          label="Avg engagement / cast"
          value={avgEngagementPerCast.toFixed(1)}
          hint="Total engagement / number of casts"
        />
      </div>
    </div>
  );
}
