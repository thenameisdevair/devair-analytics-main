// src/lib/neynar/userCasts.ts
import { neynarFetch } from "./client";

export type CastWithMetrics = {
  id: string;
  text: string;
  createdAt: string;
  likes: number;
  recasts: number;
  replies: number;
};

export async function getUserCastsWithMetrics(
  fid: number
): Promise<CastWithMetrics[]> {
  if (!fid) return [];

  /**
   * Use Neynar feed API with a `fids` filter.
   * Docs pattern: GET /v2/farcaster/feed?feed_type=filter&filter_type=fids&fids=...
   */
  const path = `/farcaster/feed?feed_type=filter&filter_type=fids&fids=${encodeURIComponent(
    String(fid)
  )}&with_recasts=false&limit=30`;

  const data = (await neynarFetch(path)) as any;

  // Be robust to slight variations in response shape
  const rawCasts: any[] =
    (Array.isArray(data.casts) && data.casts) ||
    (Array.isArray(data.result?.casts) && data.result.casts) ||
    [];

  return rawCasts.map((cast: any) => {
    const reactions = cast.reactions || {};
    const repliesObj = cast.replies || {};

    const likes =
      typeof reactions.likes_count === "number"
        ? reactions.likes_count
        : Array.isArray(reactions.likes)
        ? reactions.likes.length
        : 0;

    const recasts =
      typeof reactions.recasts_count === "number"
        ? reactions.recasts_count
        : Array.isArray(reactions.recasts)
        ? reactions.recasts.length
        : 0;

    const replies =
      typeof repliesObj.count === "number"
        ? repliesObj.count
        : typeof cast.replies_count === "number"
        ? cast.replies_count
        : 0;

    const ts =
      typeof cast.timestamp === "number"
        ? new Date(cast.timestamp * 1000).toISOString()
        : typeof cast.timestamp === "string"
        ? cast.timestamp
        : new Date().toISOString();

    return {
      id:
        cast.hash ||
        cast.id ||
        `${cast.author?.fid ?? "0"}-${cast.timestamp ?? ""}`,
      text: cast.text ?? cast.raw_text ?? "",
      createdAt: ts,
      likes,
      recasts,
      replies,
    };
  });
}
