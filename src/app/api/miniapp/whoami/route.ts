// src/app/api/miniapp/whoami/route.ts
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({} as any));

    // Farcaster mini app host should send something like:
    // { miniAppContext: { viewer: { fid, username, ... }, ... } }
    //
    // We also keep a few fallbacks (trustedData / payload) just in case
    const ctx =
      body?.miniAppContext ||
      body?.trustedData ||
      body?.payload ||
      null;

    if (!ctx) {
      return NextResponse.json(
        {
          ok: false,
          message:
            "This endpoint is meant to be called from the Farcaster mini app. " +
            "No miniAppContext / trusted data found in the request body.",
        },
        { status: 400 }
      );
    }

    // Try to locate the "viewer" / interactor object
    const viewer =
      ctx.viewer ||
      ctx.user ||
      ctx.action?.interactor ||
      ctx.interactor ||
      null;

    const fidRaw =
      viewer?.fid ??
      viewer?.user?.fid ??
      null;

    const fid =
      typeof fidRaw === "number"
        ? fidRaw
        : typeof fidRaw === "string"
        ? Number(fidRaw)
        : null;

    if (!fid || Number.isNaN(fid)) {
      console.error("[whoami] Could not find numeric fid in mini app context:", ctx);
      return NextResponse.json(
        {
          ok: false,
          message: "Could not find numeric fid in mini app context.",
          raw: ctx,
        },
        { status: 400 }
      );
    }

    const username =
      viewer.username ??
      viewer.user?.username ??
      viewer.display_name ??
      null;

    return NextResponse.json({
      ok: true,
      fid,
      username,
    });
  } catch (err: any) {
    console.error("[whoami] Unexpected error:", err);
    return NextResponse.json(
      {
        ok: false,
        message: "Internal error in /api/miniapp/whoami",
        error: err?.message ?? String(err),
      },
      { status: 500 }
    );
  }
}
