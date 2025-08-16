import Link from "next/link";
import { rockSalt } from "@/components/fonts";

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
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/40 to-black/60" aria-hidden />
      <div className="relative z-10 text-center px-6">
        <h1 className={`${rockSalt.className} text-5xl md:text-7xl tracking-tight`}>Jeremiah Miller</h1>
        <p className="mt-3 text-lg md:text-xl text-foreground/80">Singer • Songwriter • Street Performer</p>
        <div className="mt-8 flex items-center justify-center gap-4">
          <Link href="/music" className="px-6 py-3 rounded-md bg-accent text-black font-medium">
            Listen
          </Link>
          <Link
            href="/contact"
            className="px-6 py-3 rounded-md border border-foreground/30 hover:border-foreground/60 font-medium"
          >
            Book Jeremiah
          </Link>
        </div>
      </div>
    </section>
  );
}


