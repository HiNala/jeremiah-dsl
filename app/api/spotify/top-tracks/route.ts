import { NextResponse } from "next/server";
import { fetchArtistTopTracks } from "@/lib/spotify";

// Jeremiah Miller artist ID
const ARTIST_ID = "05xIKia0SX2CEsN0gtshfw";

export async function GET() {
  try {
    const tracks = await fetchArtistTopTracks(ARTIST_ID, "US");
    return NextResponse.json({ tracks });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}


