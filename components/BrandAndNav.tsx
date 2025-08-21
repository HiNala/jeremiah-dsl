"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { rockSalt } from "@/components/fonts";

export default function BrandAndNav() {
  const pathname = usePathname();
  const showLine = pathname !== "/" && pathname !== "/globe";

  return (
    <div className="fixed top-2 sm:top-4 left-0 right-0 z-50">
      <div className="w-full px-4 sm:px-8 md:px-16">
        <div className="flex items-center justify-between h-10 sm:h-12 md:h-14">
          {/* Mobile optimized nav items */}
          <Link className="font-sans text-sm sm:text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/">Home</Link>
          
          <Link className="font-sans text-sm sm:text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/globe">World</Link>
          
          {/* Center brand - responsive sizing */}
          <Link href="/about" className={`${rockSalt.className} text-lg sm:text-xl md:text-2xl tracking-tight text-white hover:text-white/90 transition-colors duration-200 text-center`}>Jeremiah Miller</Link>
          
          <Link className="font-sans text-sm sm:text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/music">Music</Link>
          
          <Link className="font-sans text-sm sm:text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/contact">Contact</Link>
        </div>
      </div>
      {/* Thin white line at bottom of nav - only on certain pages */}
      {showLine && (
        <div className="w-full h-px bg-white/20 mt-2"></div>
      )}
    </div>
  );
}


