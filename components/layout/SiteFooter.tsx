import Link from "next/link";
import { motion } from "framer-motion";

export default function SiteFooter(){
  const socialLinks = [
    { name: "Instagram", href: "https://instagram.com/jeremiahmusic" },
    { name: "TikTok", href: "https://tiktok.com/@jeremiahmusic" },
    { name: "YouTube", href: "https://youtube.com/@jeremiahmusic" },
    { name: "Spotify", href: "https://open.spotify.com/artist/jeremiahmusic" },
  ];

  const legalLinks = [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ];

  return (
    <footer className="bg-brand-night border-t border-white/10 py-10">
      <div className="mx-auto max-w-6xl px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="flex flex-wrap items-center justify-between gap-6"
        >
          {/* Social Links */}
          <div className="flex items-center gap-6 text-brand-text/80">
            {socialLinks.map((link, index) => (
              <motion.div
                key={link.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <Link 
                  href={link.href} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-brand-flame transition-colors duration-200 font-medium"
                >
                  {link.name}
                </Link>
              </motion.div>
            ))}
          </div>
          
          {/* Copyright and Legal */}
          <div className="flex items-center gap-4 text-xs text-white/60">
            <span>© {new Date().getFullYear()} Jeremiah Miller.</span>
            <div className="flex items-center gap-2">
              {legalLinks.map((link, index) => (
                <span key={link.name} className="flex items-center gap-2">
                  <Link 
                    href={link.href} 
                    className="underline underline-offset-2 hover:text-brand-flame transition-colors"
                  >
                    {link.name}
                  </Link>
                  {index < legalLinks.length - 1 && <span>·</span>}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
}
