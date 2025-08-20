"use client";

import { useEffect, useRef, useState } from "react";

// Spotify embeds
const SPOTIFY_ARTIST_EMBED =
  "https://open.spotify.com/embed/artist/05xIKia0SX2CEsN0gtshfw?utm_source=generator";
// If you have a specific playlist to feature, set it here (or via env)
const SPOTIFY_PLAYLIST_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_URL || "";
const SPOTIFY_ARTIST_URL = "https://open.spotify.com/artist/05xIKia0SX2CEsN0gtshfw";

declare global {
  interface Window {
    onSpotifyWebPlaybackSDKReady?: () => void;
    Spotify?: any;
  }
}

export default function SpotifySlideout() {
  const [thumbUrl, setThumbUrl] = useState<string | null>(null);
  const [trackTitle, setTrackTitle] = useState<string>("Jeremiah Miller");
  const [trackArtist, setTrackArtist] = useState<string>("Top tracks");
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const playerRef = useRef<any>(null);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  useEffect(() => {
    // Use Spotify oEmbed to fetch artist image
    const targetUrl = SPOTIFY_PLAYLIST_EMBED || SPOTIFY_ARTIST_URL;
    const oembedUrl = `https://open.spotify.com/oembed?url=${encodeURIComponent(targetUrl)}`;
    fetch(oembedUrl)
      .then((r) => r.json())
      .then((data) => {
        if (data?.thumbnail_url) setThumbUrl(data.thumbnail_url);
      })
      .catch(() => {
        // Silent fail; keep defaults
      });
  }, []);

  // Load Web Playback SDK and connect if credentials are configured
  useEffect(() => {
    let script: HTMLScriptElement | null = null;
    let cancelled = false;
    async function setup() {
      try {
        const tokenRes = await fetch("/api/spotify/token", { cache: "no-store" });
        const tokenJson = await tokenRes.json();
        if (!tokenJson?.ok || !tokenJson?.access_token) {
          return; // Not configured – fall back to static view
        }

        // Load SDK
        await new Promise<void>((resolve) => {
          if (window.Spotify) return resolve();
          script = document.createElement("script");
          script.src = "https://sdk.scdn.co/spotify-player.js";
          script.async = true;
          document.body.appendChild(script);
          window.onSpotifyWebPlaybackSDKReady = () => resolve();
        });

        if (cancelled) return;
        const player = new window.Spotify.Player({
          name: "Jeremiah Player",
          getOAuthToken: (cb: (t: string) => void) => cb(tokenJson.access_token),
          volume: 0.7,
        });

        player.addListener("ready", ({ device_id }: any) => {
          setDeviceId(device_id);
        });
        player.addListener("player_state_changed", (state: any) => {
          if (!state) return;
          setIsPlaying(!state.paused);
          const current = state.track_window?.current_track;
          if (current) {
            setTrackTitle(current.name || "");
            setTrackArtist(current.artists?.map((a: any) => a.name).join(", ") || "");
            const art = current.album?.images?.[0]?.url || null;
            if (art) setThumbUrl(art);
          }
        });

        await player.connect();
        playerRef.current = player;
      } catch {
        // ignore – fallback remains
      }
    }
    setup();
    return () => {
      cancelled = true;
      if (script && script.parentNode) script.parentNode.removeChild(script);
      if (playerRef.current) playerRef.current.disconnect();
    };
  }, []);

  async function ensureTransfer() {
    if (!deviceId) return;
    try {
      const tokenRes = await fetch("/api/spotify/token", { cache: "no-store" });
      const tokenJson = await tokenRes.json();
      if (!tokenJson?.access_token) return;
      await fetch("https://api.spotify.com/v1/me/player", {
        method: "PUT",
        headers: { Authorization: `Bearer ${tokenJson.access_token}`, "Content-Type": "application/json" },
        body: JSON.stringify({ device_ids: [deviceId], play: true }),
      });
    } catch {/* ignore */}
  }

  function onPlayPause() {
    if (!playerRef.current) {
      window.open(SPOTIFY_ARTIST_URL, "_blank");
      return;
    }
    ensureTransfer().then(() => playerRef.current.togglePlay());
  }

  function onNext() {
    if (!playerRef.current) {
      window.open(SPOTIFY_ARTIST_URL, "_blank");
      return;
    }
    ensureTransfer().then(() => playerRef.current.nextTrack());
  }

  function onPrev() {
    if (!playerRef.current) {
      window.open(SPOTIFY_ARTIST_URL, "_blank");
      return;
    }
    ensureTransfer().then(() => playerRef.current.previousTrack());
  }

  return (
    <div className="absolute left-0 bottom-0 z-40 p-4 sm:p-6 select-none">
      {/* Fully functional collapsed widget */}
      <div className="w-[320px] h-[96px] bg-[#2a2a2a] rounded-xl shadow-xl overflow-hidden border border-black/10">
        <div className="flex h-full">
          {/* Left: album/artist image */}
          <div className="w-[120px] h-full relative">
            {thumbUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={thumbUrl} alt="Album artwork" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-gray-600 to-gray-700" />
            )}
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/10" />
          </div>

          {/* Right: content area with clean layout */}
          <div className="flex-1 relative px-3 py-2 flex flex-col justify-between">
            {/* Spotify logo top-right */}
            <a
              href={SPOTIFY_ARTIST_URL}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Open in Spotify"
              className="absolute right-2 top-2 text-gray-400 hover:text-white"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0C5.374 0 0 5.372 0 12c0 6.627 5.374 12 12 12s12-5.373 12-12C24 5.372 18.626 0 12 0zm5.485 17.273a.748.748 0 01-1.028.247c-2.811-1.718-6.354-2.107-10.528-1.152a.75.75 0 01-.322-1.463c4.532-.998 8.45-.56 11.5 1.293.357.218.47.682.278 1.075zm1.469-3.265a.936.936 0 01-1.284.308c-3.219-1.98-8.121-2.555-11.92-1.393a.936.936 0 11-.544-1.792c4.301-1.306 9.67-.653 13.356 1.593.443.272.584.86.392 1.284zm.128-3.408c-3.867-2.297-10.283-2.507-13.985-1.372a1.122 1.122 0 11-.646-2.155c4.286-1.285 11.353-1.03 15.774 1.565a1.122 1.122 0 01-1.143 1.962z" />
              </svg>
            </a>

            {/* Text stack */}
            <div className="text-center px-2 pr-6">
              <p className="text-white text-[15px] font-semibold leading-tight truncate">{trackTitle}</p>
              <p className="text-[#b3b3b3] text-[13px] leading-tight truncate">{trackArtist}</p>
              <p className="text-[#b3b3b3] text-[12px] leading-tight truncate">{isPlaying ? "Playing" : "Paused"}</p>
            </div>

            {/* Control bar */}
            <div className="flex items-center justify-center gap-4">
              <button
                type="button"
                aria-label="Previous Track"
                className="text-gray-300 hover:text-white transition-transform duration-150 hover:scale-110"
                onClick={onPrev}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 6h2v12H6zm3.5 6l8.5 6V6z" />
                </svg>
              </button>
              <button
                type="button"
                aria-label="Play/Pause"
                className="text-white hover:text-gray-200 transition-transform duration-150 hover:scale-110"
                onClick={onPlayPause}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  {isPlaying ? <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              </button>
              <button
                type="button"
                aria-label="Next Track"
                className="text-gray-300 hover:text-white transition-transform duration-150 hover:scale-110"
                onClick={onNext}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M6 18l8.5-6L6 6v12zM16 6v12h2V6h-2z" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}