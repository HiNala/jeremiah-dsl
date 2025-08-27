"use client";

export default function MarqueeBanner() {
  const parts = [
    "DO IT NERVOUS",
    "JEREMIAH MILLER",
    "MADE WITH LOVE",
    "JEREMIAH MILLER",
    "AROUND THE WORLD",
  ];
  const text = ` ${parts.join(" • ")} `;
  const repeated = new Array(20).fill(text + " • ").join("");
  return (
    <section aria-hidden className="relative w-full bg-black text-white py-3 overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none" />
      <div className="overflow-hidden whitespace-nowrap">
        <div className="marquee inline-block uppercase tracking-[0.35em] text-sm sm:text-base opacity-80">
          {repeated}
        </div>
      </div>
      {/* Ultra-thin white accent line at bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-white/70" style={{ transform: 'scaleY(0.35)', transformOrigin: 'bottom' }} />
      <style jsx>{`
        .marquee {
          animation: jm-scroll 180s linear infinite;
        }
        @keyframes jm-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </section>
  );
}



