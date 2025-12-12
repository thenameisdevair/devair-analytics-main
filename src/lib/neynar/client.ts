// src/lib/neynar/client.ts

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BASE_URL = "https://api.neynar.com/v2";

if (!NEYNAR_API_KEY) {
  console.warn(
    "[neynar] NEYNAR_API_KEY is not set. Set it in .env.local or Vercel env to enable live data."
  );
}

/**
 * Low-level helper for calling Neynar.
 * Example path: `/farcaster/user/by_username?username=devair-md`
 */
export async function neynarFetch(path: string) {
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY is missing");
  }

  const res = await fetch(`${NEYNAR_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": NEYNAR_API_KEY,
    },
    cache: "no-store", // 🔒 always hit Neynar, no Next.js caching
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(
      `[neynar] ${res.status} ${res.statusText} – ${text.slice(0, 200)}`
    );
  }

  return res.json();
}

/**
 * Fetch a user by username.
 * Neynar docs: GET /v2/farcaster/user/by_username?username=...
 */
export async function getUserProfileByUsername(username: string) {
  const data = await neynarFetch(
    `/farcaster/user/by_username?username=${encodeURIComponent(username)}`
  );
  // Neynar returns { user: { ... } }
  return data;
}

/**
 * Fetch a user by fid.
 * Neynar docs: GET /v2/farcaster/user?fid=...
 */
export async function getUserProfileByFid(fid: number) {
  const data = await neynarFetch(
    `/farcaster/user?fid=${encodeURIComponent(String(fid))}`
  );
  // Neynar returns { user: { ... } }
  return data;
}
