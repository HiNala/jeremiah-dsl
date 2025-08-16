"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

// Jeremiah's Spotify artist page (plays top tracks like FLY)
// Source: https://open.spotify.com/artist/05xIKia0SX2CEsN0gtshfw
const SPOTIFY_ARTIST_EMBED =
  "https://open.spotify.com/embed/artist/05xIKia0SX2CEsN0gtshfw?utm_source=generator";

export default function SpotifySlideout() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

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
          <div className="z-30 flex flex-col w-40 h-20 transition-all duration-300 bg-white shadow-md group-hover/he:h-[264px] group-hover/he:w-[400px] rounded-2xl shadow-zinc-400 overflow-hidden">
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
                <p className="text-xl font-bold">Jeremiah Miller</p>
                <p className="text-zinc-600">Popular: FLY</p>
              </div>
            </div>
            {/* Spotify embed replaces internal controls to ensure playback of top tracks like FLY */}
            <div className="relative hidden group-hover/he:block mt-1">
              <iframe
                className="w-full h-[200px]"
                src={SPOTIFY_ARTIST_EMBED}
                title="Spotify player"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture; web-share"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


