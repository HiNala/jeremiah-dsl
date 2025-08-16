import Link from "next/link";
import SpotifySlideout from "@/components/SpotifySlideout";

export default function VideoHero() {
  return (
    <section className="relative h-[100svh] w-full grid place-items-center overflow-hidden">
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
      {/* Subtle landscape oval vignette with very light feathering */}
      <div
        className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(65%_45%_at_50%_50%,_rgba(0,0,0,0)_62%,_rgba(0,0,0,0.06)_80%,_rgba(0,0,0,0.12)_92%,_rgba(0,0,0,0.16)_100%)]"
        aria-hidden
      />
      <SpotifySlideout />
    </section>
  );
}


