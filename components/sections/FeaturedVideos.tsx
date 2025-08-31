"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { div as MotionDiv, h2 as MotionH2, h3 as MotionH3 } from "framer-motion/client";

type VideoItem = {
  id: string;
  poster?: string;     // /images/... (optional for YouTube videos)
  href: string;        // external IG/YT URL
  caption: string;     // e.g., "A LITTLE MORE"
};

export default function FeaturedVideos({
  items,
  className,
  title = "Videos",
  showHeader = true,
}: { items: VideoItem[]; className?: string; title?: string; showHeader?: boolean }) {
  const [idx, setIdx] = useState(0);
  const safeItems = items && items.length ? items : [];
  const current = safeItems.length ? safeItems[(idx + safeItems.length) % safeItems.length] : undefined;
  return (
    <section id="videos" className={cn("relative py-24 md:py-32 overflow-hidden", className)}>
      {/* New background image */}
      <div className="absolute inset-0" aria-hidden>
        <Image
          src={require("../../img/ChatGPT Image Aug 27, 2025, 10_38_26 PM.png")}
          alt=""
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {/* Section Header */}
        {showHeader && (
          <div className="text-center mb-20">
            <MotionH2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="text-6xl md:text-8xl font-bold text-white mb-6 tracking-tight"
            >
              {title}
            </MotionH2>
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <p className="text-2xl md:text-3xl text-white/70 font-light max-w-3xl mx-auto leading-relaxed">
                Watch the latest performances and behind-the-scenes moments
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-brand-flame to-brand-glow mx-auto mt-6 rounded-full" />
            </MotionDiv>
          </div>
        )}

        {/* Single centered video card with nav arrows */}
        {current && (
          <div className="relative">
            {/* Nav arrows */}
            <button
              aria-label="Previous"
              onClick={() => setIdx((v) => (v - 1 + safeItems.length) % safeItems.length)}
              className="hidden md:flex absolute left-6 top-1/2 -translate-y-1/2 items-center justify-center text-white z-10"
            >
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
              </svg>
            </button>
            <button
              aria-label="Next"
              onClick={() => setIdx((v) => (v + 1) % safeItems.length)}
              className="hidden md:flex absolute right-6 top-1/2 -translate-y-1/2 items-center justify-center text-white z-10"
            >
              <svg width="56" height="56" viewBox="0 0 24 24" fill="currentColor" className="drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
                <path d="M8.59 7.41 10 6l6 6-6 6-1.41-1.41L13.17 12z"/>
              </svg>
            </button>

            <MotionDiv
              key={current.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="group relative max-w-4xl mx-auto"
            >
              {/* Video Card Container */}
              <div className="relative overflow-hidden rounded-3xl shadow-2xl border-4 border-sky-400/70">
                {/* If YouTube link, embed iframe, else keep poster */}
                {(() => {
                  const url = current.href || "";
                  const ytIdMatch = url.match(/(?:v=|\.be\/)\s*([\w-]{11})/);
                  const ytId = ytIdMatch ? ytIdMatch[1] : undefined;
                  if (ytId) {
                    const embed = `https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1&color=white`;
                    return (
                      <div className="relative aspect-[16/9] overflow-hidden">
                        <iframe
                          src={embed}
                          className="absolute inset-0 h-full w-full"
                          title={current.caption}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                          allowFullScreen
                        />
                      </div>
                    );
                  }
                  return (
                    <Link href={url} target="_blank" rel="noopener noreferrer" className="block">
                      <div className="relative aspect-[16/9] overflow-hidden">
                        {current.poster && (
                          <Image
                            src={current.poster}
                            alt={current.caption}
                            fill
                            className="object-cover transition-all duration-700 group-hover:scale-105"
                            sizes="(max-width: 1024px) 100vw, 800px"
                          />
                        )}
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="relative w-24 h-24 md:w-28 md:h-28 rounded-full bg-white/95 backdrop-blur-sm flex items-center justify-center shadow-2xl">
                            <svg viewBox="0 0 24 24" className="w-10 h-10 text-black ml-1" fill="currentColor">
                              <path d="M8 5v14l11-7z"/>
                            </svg>
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })()}
                {/* Caption */}
                <div className="absolute -bottom-2 left-0 right-0 flex justify-center">
                  <div className="px-4 py-2 rounded-full bg-black/80 text-white font-semibold shadow-lg">{current.caption}</div>
                </div>
              </div>
            </MotionDiv>
          </div>
        )}

        {/* See all */}
        <div className="text-center mt-8">
          <Link
            href="https://www.instagram.com/jeremiahmusic"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-sky-500/30 hover:bg-sky-500/50 text-white px-6 py-3 rounded-full border border-sky-300/40 backdrop-blur-sm"
          >
            See All Videos
            <span className="text-lg">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}