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

      {/* No overlay mask - show raw video */}

      {/* Remove all hero text/buttons to expose full video */}

      {/* Spotify component */}
      <SpotifySlideout />
    </section>
  );
}