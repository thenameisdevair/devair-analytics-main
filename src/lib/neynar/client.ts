// src/lib/neynar/client.ts

const NEYNAR_API_KEY = process.env.NEYNAR_API_KEY;
const NEYNAR_BASE_URL = "https://api.neynar.com/v2";

if (!NEYNAR_API_KEY) {
  console.warn(
    "[neynar] NEYNAR_API_KEY is not set. Set it in .env.local to enable live data."
  );
}

export async function neynarFetch(path: string) {
  if (!NEYNAR_API_KEY) {
    throw new Error("NEYNAR_API_KEY is missing");
  }

  const res = await fetch(`${NEYNAR_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      "x-api-key": NEYNAR_API_KEY,
    },
    cache: "no-store",
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
 * Fetch a single Farcaster user by username.
 * Docs: GET /v2/farcaster/user/by_username?username=...
 */
export async function getUserProfileByUsername(username: string) {
  const data = await neynarFetch(
    `/farcaster/user/by_username?username=${encodeURIComponent(username)}`
  );
  return data; // Neynar returns { user: { ... } }
}
