"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import type { SpotifyTrack } from "@/lib/spotify";

const ARTIST_SPOTIFY_URL = "https://open.spotify.com/artist/05xIKia0SX2CEsN0gtshfw";

export default function SpotifySlideout() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  // Fetch top tracks once visible so we do not call API off-screen
  const [tracks, setTracks] = useState<SpotifyTrack[] | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (!visible || tracks) return;
    fetch("/api/spotify/top-tracks", { cache: "no-store" })
      .then((r) => r.json())
      .then((json) => setTracks(json.tracks as SpotifyTrack[]))
      .catch(() => setTracks([]));
  }, [visible, tracks]);

  const currentTrack = useMemo(() => (tracks && tracks[currentIndex]) || null, [tracks, currentIndex]);

  function nextTrack() {
    if (!tracks || tracks.length === 0) return;
    setCurrentIndex((i) => (i + 1) % tracks.length);
  }

  function prevTrack() {
    if (!tracks || tracks.length === 0) return;
    setCurrentIndex((i) => (i - 1 + tracks.length) % tracks.length);
  }

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.pause();
    if (currentTrack?.previewUrl) {
      audioRef.current.src = currentTrack.previewUrl;
      audioRef.current.play().catch(() => {});
    } else {
      audioRef.current.removeAttribute("src");
    }
  }, [currentTrack]);

  return (
    <div className="absolute left-0 bottom-0 z-40 p-4 sm:p-6">
      <div
        className={
          `transform transition-transform duration-700 ease-out ` +
          (visible ? "translate-x-0" : "-translate-x-[85%]")
        }
      >
        <div className="flex flex-col items-center group/he select-none">
          <div className="relative z-0 h-16 -mb-2 transition-all duration-200 group-hover/he:h-0">
            <svg width={128} height={128} viewBox="0 0 128 128" className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5 animate-[spin_3s_linear_infinite] transition-all">
              <svg>
                <rect width={128} height={128} fill="black" />
                <circle cx={20} cy={20} r={2} fill="white" />
                <circle cx={40} cy={30} r={2} fill="white" />
                <circle cx={60} cy={10} r={2} fill="white" />
                <circle cx={80} cy={40} r={2} fill="white" />
                <circle cx={100} cy={20} r={2} fill="white" />
                <circle cx={120} cy={50} r={2} fill="white" />
                <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
                <circle cx={90} cy={30} r={8} fill="white" />
                <path d="M0 128 Q32 64 64 128 T128 128" fill="purple" stroke="black" strokeWidth={1} />
                <path d="M0 128 Q32 48 64 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
                <path d="M0 128 Q32 32 64 128 T128 128" fill="rebeccapurple" stroke="black" strokeWidth={1} />
                <path d="M0 128 Q16 64 32 128 T64 128" fill="purple" stroke="black" strokeWidth={1} />
                <path d="M64 128 Q80 64 96 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
              </svg>
            </svg>
            <div className="absolute z-10 w-8 h-8 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-12 left-12" />
          </div>
          <div className="z-30 flex flex-col w-40 h-20 transition-all duration-300 bg-white shadow-md group-hover/he:h-[264px] group-hover/he:w-[420px] rounded-2xl shadow-zinc-400 overflow-hidden">
            <div className="flex flex-row w-full h-0 group-hover/he:h-16">
              <div className="relative flex items-center justify-center w-24 h-24 group-hover/he:-top-6 group-hover/he:-left-4 opacity-0 group-hover/he:animate-[spin_3s_linear_infinite] group-hover/he:opacity-100 transition-all duration-100">
                <svg width={96} height={96} viewBox="0 0 128 128" className="duration-500 border-4 rounded-full shadow-md border-zinc-400 border-spacing-5">
                  <svg>
                    <rect width={128} height={128} fill="black" />
                    <circle cx={20} cy={20} r={2} fill="white" />
                    <circle cx={40} cy={30} r={2} fill="white" />
                    <circle cx={60} cy={10} r={2} fill="white" />
                    <circle cx={80} cy={40} r={2} fill="white" />
                    <circle cx={100} cy={20} r={2} fill="white" />
                    <circle cx={120} cy={50} r={2} fill="white" />
                    <circle cx={90} cy={30} r={10} fill="white" fillOpacity="0.5" />
                    <circle cx={90} cy={30} r={8} fill="white" />
                    <path d="M0 128 Q32 64 64 128 T128 128" fill="purple" stroke="black" strokeWidth={1} />
                    <path d="M0 128 Q32 48 64 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
                    <path d="M0 128 Q32 32 64 128 T128 128" fill="rebeccapurple" stroke="black" strokeWidth={1} />
                    <path d="M0 128 Q16 64 32 128 T64 128" fill="purple" stroke="black" strokeWidth={1} />
                    <path d="M64 128 Q80 64 96 128 T128 128" fill="mediumpurple" stroke="black" strokeWidth={1} />
                  </svg>
                </svg>
                <div className="absolute z-10 w-6 h-6 bg-white border-4 rounded-full shadow-sm border-zinc-400 top-9 left-9" />
              </div>
              <div className="flex flex-col justify-center w-full pl-3 -ml-24 overflow-hidden group-hover/he:-ml-3 text-nowrap">
                <p className="text-xl font-bold">{currentTrack?.name ?? "Jeremiah Miller"}</p>
                <p className="text-zinc-600">{currentTrack ? currentTrack.artistNames.join(", ") : "Top tracks"}</p>
              </div>
            </div>
            <div className="relative hidden group-hover/he:block mt-1 px-4 pb-3">
              <div className="flex items-center gap-3">
                <button aria-label="Previous" onClick={prevTrack} className="p-2 rounded hover:bg-zinc-100">
                  ◀︎
                </button>
                <button
                  aria-label="Play/Pause"
                  onClick={() => {
                    const a = audioRef.current;
                    if (!a) return;
                    if (a.paused) a.play().catch(() => {});
                    else a.pause();
                  }}
                  className="p-2 rounded bg-accent text-black px-3"
                >
                  ▶︎
                </button>
                <button aria-label="Next" onClick={nextTrack} className="p-2 rounded hover:bg-zinc-100">
                  ▶︎
                </button>
                <Link href={currentTrack?.externalUrl || ARTIST_SPOTIFY_URL} target="_blank" className="ml-auto text-sm underline">
                  Open in Spotify
                </Link>
              </div>
              <audio ref={audioRef} preload="none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


