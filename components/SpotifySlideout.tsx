"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function SpotifySlideout() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 150);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="absolute left-0 bottom-0 z-10 p-4 sm:p-6">
      <div
        className={
          `transform transition-transform duration-700 ease-out ` +
          (visible ? "translate-x-0" : "-translate-x-[85%]")
        }
      >
        <div className="rounded-lg overflow-hidden shadow-xl shadow-black/30 bg-black/70 backdrop-blur">
          <iframe
            className="w-[320px] h-[152px] sm:w-[380px] sm:h-[200px]"
            src="https://open.spotify.com/embed/track/11dFghVXANMlKmJXsNCbNl?utm_source=generator"
            title="Spotify player"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            loading="lazy"
          />
          <div className="p-3 flex items-center gap-3 border-t border-white/10">
            <Link href="/music" className="px-4 py-2 rounded-md bg-accent text-black font-medium">
              Listen More
            </Link>
            <Link
              href="/contact"
              className="px-4 py-2 rounded-md border border-foreground/30 hover:border-foreground/60 font-medium"
            >
              Book Jeremiah
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}


