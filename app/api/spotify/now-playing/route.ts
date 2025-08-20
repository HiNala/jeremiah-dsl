import { NextResponse } from "next/server";
import { fetchNowPlaying, isSpotifyApiConfigured } from "@/lib/spotify";

export async function GET() {
  if (!isSpotifyApiConfigured()) {
    return NextResponse.json({ 
      is_playing: false, 
      reason: "Not configured" 
    }, { status: 200 });
  }
  
  try {
    const data = await fetchNowPlaying();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("Spotify now-playing error:", error.message);
    return NextResponse.json({ 
      is_playing: false, 
      reason: "API error" 
    }, { status: 200 });
  }
}


