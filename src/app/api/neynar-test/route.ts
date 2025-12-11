// src/app/api/neynar-test/route.ts
import { NextResponse } from "next/server";
import { getUserProfileByUsername } from "../../../lib/neynar/client";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const username = url.searchParams.get("username") || "v"; // change default if you want

  try {
    const data = await getUserProfileByUsername(username);
    return NextResponse.json(data);
  } catch (err: any) {
    console.error("[neynar-test] error", err);
    return NextResponse.json(
      { error: err.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
