"use client";
import SpotifySlideout from "@/components/SpotifySlideout";
import { div as MotionDiv } from "framer-motion/client";

export default function VideoHero() {
  return (
    <section className="relative h-[100svh] w-full grid place-items-center overflow-hidden">
      {/* Video Background */}
      <video
        className="absolute inset-0 h-full w-full object-cover"
        playsInline
        autoPlay
        muted
        loop
        poster="/media/hero-poster.jpg"
      >
        <source src="https://j-miller.s3.us-west-1.amazonaws.com/Jeremiah+BeachCompressed.mp4" type="video/mp4" />
        <source src="/media/hero-4k.webm" type="video/webm" />
        <source src="/media/hero-4k.mp4" type="video/mp4" />
        <source src="/media/hero-1080.mp4" type="video/mp4" />
      </video>

      {/* Subtle dark tint */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10 bg-black/5"
      />

      {/* Very light grain texture overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 64 64'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='1' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
          backgroundRepeat: "repeat",
          backgroundSize: "64px 64px",
          mixBlendMode: "soft-light",
          opacity: 0.04,
        }}
      />

      {/* Remove all hero text/buttons to expose full video */}

      {/* Spotify component (anchored to section's lower-left) */}
      <SpotifySlideout />
    </section>
  );
}