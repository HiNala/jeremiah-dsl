import { NextResponse } from "next/server";
import { isSpotifyApiConfigured } from "@/lib/spotify";

// Small endpoint that returns an access token to the browser for the
// Web Playback SDK via the existing refresh-token flow in lib/spotify.
// We do NOT expose client secret; we only mint short-lived access tokens.

export async function GET() {
  if (!isSpotifyApiConfigured()) {
    return NextResponse.json({ ok: false, reason: "Not configured" }, { status: 200 });
  }

  try {
    // Reuse the token endpoint via internal call to lib/spotify by importing the function
    const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
    const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
    const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || "";

    const creds = Buffer.from(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`, "utf8").toString("base64");
    const res = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        Authorization: `Basic ${creds}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "refresh_token",
        refresh_token: SPOTIFY_REFRESH_TOKEN,
      }),
    });

    const json = (await res.json()) as any;
    if (!res.ok || !json.access_token) {
      return NextResponse.json({ ok: false, reason: "Token error" }, { status: 200 });
    }

    return NextResponse.json({ ok: true, access_token: json.access_token }, { status: 200 });
  } catch (e) {
    return NextResponse.json({ ok: false, reason: "Token error" }, { status: 200 });
  }
}


