"use client";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type VideoItem = {
  id: string;
  poster: string;     // /images/...
  href: string;       // external IG/YT URL
  caption: string;    // e.g., "A LITTLE MORE"
};

export default function FeaturedVideos({
  items,
  className,
  title = "Videos",
}: { items: VideoItem[]; className?: string; title?: string }) {
  return (
    <section className={cn("bg-brand-night py-14 md:py-20", className)}>
      <div className="mx-auto max-w-6xl px-4">
        <h2 className="text-center text-4xl md:text-5xl font-semibold text-white mb-8">{title}</h2>

        <div className="grid gap-6 md:grid-cols-2">
          {items.map((v, i) => (
            <motion.div
              key={v.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden rounded-2xl ring-1 ring-white/10"
            >
              <Link href={v.href} target="_blank" rel="noopener noreferrer" data-analytics="video_tile_click">
                <div className="relative aspect-video">
                  <Image 
                    src={v.poster} 
                    alt={v.caption} 
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                  {/* Play triangle */}
                  <div
                    aria-hidden
                    className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
                  >
                    <svg viewBox="0 0 100 100" className="h-24 w-24 md:h-32 md:w-32 drop-shadow-xl">
                      <polygon points="35,25 35,75 75,50" className="fill-white/80 group-hover:fill-white transition" />
                    </svg>
                  </div>
                  {/* Caption */}
                  <div className="pointer-events-none absolute bottom-4 left-0 right-0 flex items-center justify-center">
                    <span className="rounded-full border border-white/30 bg-black/30 px-4 py-1 text-sm tracking-widest text-white/90 backdrop-blur-sm">
                      {v.caption.toUpperCase()}
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
