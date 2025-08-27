"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { rockSalt } from "@/components/fonts";

export default function BrandAndNav() {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!isHomePage) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHomePage]);

  return (
    <>
      {/* Conditional navigation styling - transparent on home, solid elsewhere */}
      <div className={`${isHomePage ? 'fixed' : 'sticky'} top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isHomePage 
          ? (scrolled ? 'bg-black shadow-lg' : 'bg-transparent') 
          : 'bg-black shadow-lg'
      }`}>
        <div className="w-full px-4 sm:px-8 md:px-16">
          <div className={`flex items-center justify-between ${scrolled ? 'h-12 sm:h-14' : 'h-16 sm:h-18 md:h-20'}`}>
            {/* Navigation items */}
            <Link 
              className={`font-sans text-sm sm:text-base md:text-lg font-semibold tracking-wide transition-all duration-200 hover:scale-105 ${
                isHomePage 
                  ? 'text-white hover:text-brand-flame drop-shadow-lg' 
                  : 'text-white hover:text-white/80'
              }`} 
              href="/"
            >
              Home
            </Link>
            
            <Link 
              className={`font-sans text-sm sm:text-base md:text-lg font-semibold tracking-wide transition-all duration-200 hover:scale-105 ${
                isHomePage 
                  ? 'text-white hover:text-brand-flame drop-shadow-lg' 
                  : 'text-white hover:text-white/80'
              }`} 
              href="/globe"
            >
              World
            </Link>
            
            {/* Center brand - Enhanced handwritten style */}
            <Link 
              href="/about" 
              className={`${rockSalt.className} text-2xl sm:text-3xl md:text-4xl transition-all duration-200 hover:scale-110 text-center font-normal ${
                isHomePage 
                  ? 'text-white hover:text-brand-glow drop-shadow-2xl' 
                  : 'text-white hover:text-white/90'
              }`}
            >
              Jeremiah Miller
            </Link>
            
            <Link 
              className={`font-sans text-sm sm:text-base md:text-lg font-semibold tracking-wide transition-all duration-200 hover:scale-105 ${
                isHomePage 
                  ? 'text-white hover:text-brand-flame drop-shadow-lg' 
                  : 'text-white hover:text-white/80'
              }`} 
              href="/music"
            >
              Music
            </Link>
            
            <Link 
              className={`font-sans text-sm sm:text-base md:text-lg font-semibold tracking-wide transition-all duration-200 hover:scale-105 ${
                isHomePage 
                  ? 'text-white hover:text-brand-flame drop-shadow-lg' 
                  : 'text-white hover:text-white/80'
              }`} 
              href="/contact"
            >
              Contact
            </Link>
          </div>
        </div>

        {/* Optional bottom border turned off on hero to avoid visible bar */}
        {!isHomePage && (
          <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        )}
      </div>
      
      {/* No spacer needed; sticky header reserves its own space */}
    </>
  );
}