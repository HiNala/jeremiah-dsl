// Server-side Spotify helpers: exchange refresh token for access token and
// proxy simple playback APIs.

const SPOTIFY_CLIENT_ID = process.env.SPOTIFY_CLIENT_ID || "";
const SPOTIFY_CLIENT_SECRET = process.env.SPOTIFY_CLIENT_SECRET || "";
const SPOTIFY_REFRESH_TOKEN = process.env.SPOTIFY_REFRESH_TOKEN || "";

export function isSpotifyApiConfigured(): boolean {
  return (
    Boolean(SPOTIFY_CLIENT_ID) &&
    Boolean(SPOTIFY_CLIENT_SECRET) &&
    Boolean(SPOTIFY_REFRESH_TOKEN)
  );
}

async function getAccessToken(): Promise<string> {
  const creds = Buffer.from(
    `${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`,
    "utf8"
  ).toString("base64");

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
    // Avoid Next caching
    cache: "no-store",
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to get Spotify access token: ${res.status} ${text}`);
  }

  const json = (await res.json()) as { access_token: string };
  return json.access_token;
}

export async function fetchNowPlaying() {
  const token = await getAccessToken();
  const res = await fetch(
    "https://api.spotify.com/v1/me/player/currently-playing",
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    }
  );

  if (res.status === 204) {
    return { is_playing: false };
  }

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed now playing: ${res.status} ${text}`);
  }

  const json = await res.json();
  // Normalize response shape for the client
  const item = json.item || json.track || {};
  const album = item.album || {};
  const images = album.images || [];
  const artists = item.artists || [];
  const data = {
    is_playing: Boolean(json.is_playing),
    progress_ms: json.progress_ms ?? 0,
    duration_ms: item.duration_ms ?? 0,
    name: item.name || "",
    album: album.name || "",
    artist: artists.map((a: any) => a.name).join(", "),
    image: images[0]?.url || images[1]?.url || images[2]?.url || null,
  };
  return data;
}

export async function controlPlayback(action: "play" | "pause" | "next" | "previous") {
  const token = await getAccessToken();
  let url = "https://api.spotify.com/v1/me/player/";
  let method: "POST" | "PUT";
  switch (action) {
    case "play":
      url += "play";
      method = "PUT";
      break;
    case "pause":
      url += "pause";
      method = "PUT";
      break;
    case "next":
      url += "next";
      method = "POST";
      break;
    case "previous":
      url += "previous";
      method = "POST";
      break;
  }

  const res = await fetch(url, {
    method,
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok && res.status !== 204) {
    const text = await res.text();
    throw new Error(`Failed to ${action}: ${res.status} ${text}`);
  }

  return { ok: true };
}



