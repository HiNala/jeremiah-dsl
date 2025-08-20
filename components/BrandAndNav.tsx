import Link from "next/link";
import { rockSalt } from "@/components/fonts";

export default function BrandAndNav() {
  return (
    <div className="fixed top-4 left-0 right-0 z-50">
      <div className="w-full px-8 md:px-16">
        <div className="flex items-center justify-between h-12 md:h-14">
          {/* All nav items with equal spacing */}
          <Link className="font-sans text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/about">About</Link>
          
          <Link className="font-sans text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/music">Music</Link>
          
          {/* Center brand (smaller size) */}
          <Link href="/" className={`${rockSalt.className} text-2xl md:text-3xl tracking-tight text-white`}>Jeremiah Miller</Link>
          
          <Link className="font-sans text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/globe">Globe</Link>
          
          <Link className="font-sans text-base md:text-lg font-normal text-white/90 tracking-wide hover:text-white transition-colors duration-200" href="/contact">Contact</Link>
        </div>
      </div>
    </div>
  );
}


