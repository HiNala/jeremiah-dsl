export interface SpotifyTrack {
  id: string;
  name: string;
  previewUrl: string | null;
  externalUrl: string;
  artistNames: string[];
  albumImageUrl: string | null;
}

async function getAccessToken(): Promise<string> {
  const clientId = process.env.SPOTIFY_CLIENT_ID;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    throw new Error("Missing SPOTIFY_CLIENT_ID or SPOTIFY_CLIENT_SECRET env vars");
  }
  const authHeader = Buffer.from(`${clientId}:${clientSecret}`).toString("base64");
  const tokenRes = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      Authorization: `Basic ${authHeader}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({ grant_type: "client_credentials" }),
    // Prevent Next from caching tokens inadvertently
    cache: "no-store",
  });
  if (!tokenRes.ok) {
    const text = await tokenRes.text();
    throw new Error(`Failed to fetch Spotify token: ${tokenRes.status} ${text}`);
  }
  const tokenJson = (await tokenRes.json()) as { access_token: string };
  return tokenJson.access_token;
}

export async function fetchArtistTopTracks(
  artistId: string,
  market: string = "US",
): Promise<SpotifyTrack[]> {
  const token = await getAccessToken();
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=${encodeURIComponent(market)}`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch top tracks: ${res.status} ${text}`);
  }
  const data = (await res.json()) as {
    tracks: Array<{
      id: string;
      name: string;
      preview_url: string | null;
      external_urls: { spotify: string };
      artists: Array<{ name: string }>;
      album?: { images?: Array<{ url: string; width: number; height: number }> };
    }>;
  };
  return data.tracks.map((t) => ({
    id: t.id,
    name: t.name,
    previewUrl: t.preview_url,
    externalUrl: t.external_urls.spotify,
    artistNames: t.artists.map((a) => a.name),
    albumImageUrl: t.album?.images?.[1]?.url ?? t.album?.images?.[0]?.url ?? null,
  }));
}


