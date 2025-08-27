"use client";

import Image from "next/image";

export default function FullBleedImage({ src = "/images/optimized/DSC_4034-lg.avif" }: { src?: string }) {
  return (
    <section className="relative w-full min-h-[80vh] md:min-h-[90vh] overflow-hidden bg-black">
      {/* Background image (optimized) */}
      <Image
        src={src}
        alt="Jeremiah Miller performing in the city"
        fill
        priority={false}
        className="object-cover object-center"
      />

      {/* Light grain + soft vignette to match Ed-style treatment */}
      <div className="pointer-events-none absolute inset-0">
        {/* Subtle grain */}
        <div className="absolute inset-0 opacity-25 [background-image:radial-gradient(rgba(255,255,255,0.12)_1px,transparent_1px)] [background-size:3px_3px] mix-blend-overlay" />
        {/* Gentle top/bottom fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/15" />
      </div>
    </section>
  );
}


