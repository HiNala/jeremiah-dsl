import { NextResponse } from "next/server";
import { controlPlayback, isSpotifyApiConfigured } from "@/lib/spotify";

export async function POST(request: Request) {
  if (!isSpotifyApiConfigured()) {
    return NextResponse.json({ ok: false, reason: "Not configured" }, { status: 200 });
  }

  const { action } = await request.json();
  if (!action || !["play", "pause", "next", "previous"].includes(action)) {
    return NextResponse.json({ ok: false, reason: "Invalid action" }, { status: 400 });
  }

  try {
    await controlPlayback(action);
    return NextResponse.json({ ok: true }, { status: 200 });
  } catch (error: any) {
    console.error(`Spotify ${action} error:`, error.message);
    return NextResponse.json({ 
      ok: false, 
      reason: error.message.includes("No active device") ? "No active device" : "API error" 
    }, { status: 200 });
  }
}


