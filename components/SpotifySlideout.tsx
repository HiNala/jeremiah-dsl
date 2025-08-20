"use client";

import { useState } from "react";

// Spotify embeds
const SPOTIFY_ARTIST_EMBED =
  "https://open.spotify.com/embed/artist/05xIKia0SX2CEsN0gtshfw?utm_source=generator";
// If you have a specific playlist to feature, set it here (or via env)
const SPOTIFY_PLAYLIST_EMBED = process.env.NEXT_PUBLIC_SPOTIFY_PLAYLIST_URL || "";
const SPOTIFY_ARTIST_URL = "https://open.spotify.com/artist/05xIKia0SX2CEsN0gtshfw";

export default function SpotifySlideout() {
  const [open, setOpen] = useState(false);
  const embedSrc = SPOTIFY_PLAYLIST_EMBED || SPOTIFY_ARTIST_EMBED;

  return (
    <div className="absolute left-0 bottom-0 z-40 p-4 sm:p-6 select-none">
      <div className="flex flex-col items-start">
        {/* Compact control */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Hide Spotify" : "Show Spotify"}
          onClick={() => setOpen((s) => !s)}
          className="group inline-flex items-center gap-2 rounded-full bg-[#1DB954] text-white px-4 py-2 shadow-md shadow-black/20 hover:shadow-lg hover:shadow-black/25 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#1DB954]"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="opacity-95">
            <path d="M12 0C5.374 0 0 5.372 0 12c0 6.627 5.374 12 12 12s12-5.373 12-12C24 5.372 18.626 0 12 0zm5.485 17.273a.748.748 0 01-1.028.247c-2.811-1.718-6.354-2.107-10.528-1.152a.75.75 0 01-.322-1.463c4.532-.998 8.45-.56 11.5 1.293.357.218.47.682.278 1.075zm1.469-3.265a.936.936 0 01-1.284.308c-3.219-1.98-8.121-2.555-11.92-1.393a.936.936 0 11-.544-1.792c4.301-1.306 9.67-.653 13.356 1.593.443.272.584.86.392 1.284zm.128-3.408c-3.867-2.297-10.283-2.507-13.985-1.372a1.122 1.122 0 11-.646-2.155c4.286-1.285 11.353-1.03 15.774 1.565a1.122 1.122 0 01-1.143 1.962z" />
          </svg>
          <span className="font-medium">Spotify</span>
          <span className="ml-1 text-white/80 text-sm">{open ? "Hide" : "Listen"}</span>
        </button>

        {/* Expanding panel */}
        <div className={`mt-3 w-[380px] max-w-[92vw] overflow-hidden rounded-2xl bg-white/95 backdrop-blur shadow-xl ring-1 ring-black/5 transition-[max-height,opacity] duration-500 ease-out ${open ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}`}>
          {open && (
            <>
              <iframe
                className="w-full h-[420px]"
                src={embedSrc}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title="Spotify — Jeremiah Miller"
              />
              <div className="flex items-center justify-between px-3 py-2 bg-white/80 text-sm">
                <a
                  href={SPOTIFY_ARTIST_URL}
                  target="_blank"
                  rel="noreferrer noopener"
                  className="text-[#1DB954] hover:underline"
                >
                  Open in Spotify
                </a>
                {!SPOTIFY_PLAYLIST_EMBED && (
                  <span className="text-zinc-500">Showing artist — playlist available on Spotify</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}


