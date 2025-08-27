"use client";
import Link from "next/link";
import { div as MotionDiv } from "framer-motion/client";
 

export default function SiteFooter(){
  const socialLinks = [
    { 
      name: "Instagram", 
      href: "https://instagram.com/jeremiahmusic", 
      handle: "@jeremiahmusic",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
        </svg>
      )
    },
    { 
      name: "TikTok", 
      href: "https://tiktok.com/@jeremiahmusic", 
      handle: "@jeremiahmusic",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
        </svg>
      )
    },
    { 
      name: "YouTube", 
      href: "https://youtube.com/@jeremiahmusic", 
      handle: "@jeremiahmusic",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
        </svg>
      )
    },
    { 
      name: "Spotify", 
      href: "https://open.spotify.com/artist/jeremiahmusic", 
      handle: "Jeremiah Miller",
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
          <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.42 1.56-.299.421-1.02.599-1.559.3z"/>
        </svg>
      )
    },
  ];

  const legalLinks = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms Of Use", href: "/terms" },
    { name: "Cookies Policy", href: "/cookies" },
    { name: "Cookie Settings", href: "/cookie-settings" },
  ];

  const quickLinks = [
    { name: "Book Experience", href: "/book" },
    { name: "World Tour", href: "/world" },
    { name: "Music Videos", href: "/music" },
    { name: "About", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <footer className="bg-gradient-to-t from-black via-[#0B0E12] to-[#0B0E12] relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-flame/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-glow/5 rounded-full blur-3xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        {/* Connect With Me */}
        <div className="py-12">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center space-y-8"
          >
            <h3 className="text-2xl md:text-3xl font-bold text-white">Connect With Me</h3>
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8">
              {socialLinks.map((social, index) => (
                <MotionDiv
                  key={social.name}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 + index * 0.05, duration: 0.4 }}
                  className="group"
                >
                  <Link href={social.href} target="_blank" rel="noopener noreferrer" className="block">
                    <div className="w-20 h-20 md:w-24 md:h-24 rounded-full flex items-center justify-center text-white transition-all duration-300 transform group-hover:scale-110 group-hover:-translate-y-1">
                      <div className="w-10 h-10 md:w-12 md:h-12">
                        {social.icon}
                      </div>
                    </div>
                    <div className="mt-3 text-center">
                      <div className="text-white/80 group-hover:text-white text-sm font-medium transition-colors">
                        {social.name}
                      </div>
                    </div>
                  </Link>
                </MotionDiv>
              ))}
            </div>
          </MotionDiv>
        </div>

        {/* Legal/copyright row */}
        <div className="border-t border-white/10 py-8">
          <MotionDiv
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex flex-col md:flex-row justify-between items-center gap-6"
          >
            <div className="text-center md:text-left">
              <p className="text-white/60 text-sm">© {new Date().getFullYear()} Jeremiah Miller. All rights reserved.</p>
            </div>
            <div className="flex flex-wrap justify-center items-center gap-6 text-xs">
              {legalLinks.map((link, index) => (
                <span key={link.name} className="flex items-center gap-6">
                  <Link href={link.href} className="text-white/60 hover:text-white transition-colors underline-offset-2 hover:underline">
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && <span className="text-white/30">•</span>}
                </span>
              ))}
            </div>
          </MotionDiv>
        </div>
      </div>
      
      {/* Bottom accent line (very thin) */}
      <div className="h-px bg-gradient-to-r from-brand-flame via-brand-glow to-brand-flame" style={{ transform: 'scaleY(0.35)', transformOrigin: 'bottom' }} />
    </footer>
  );
}