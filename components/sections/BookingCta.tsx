"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { div as MotionDiv, h2 as MotionH2, p as MotionP } from "framer-motion/client";

export default function BookingCta({
  imageSrc = "/images/jeremiah-planet.jpg",
}: { imageSrc?: string }) {
  const r = useRouter();
  
  return (
    <section className="bg-gradient-to-br from-[#0B0E12] via-[#1A1A1A] to-[#0B0E12] min-h-[100svh] flex items-center py-10 md:py-12 relative overflow-hidden">
      {/* Dynamic background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-brand-flame/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-brand-glow/10 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-0 w-64 h-64 bg-purple-500/5 rounded-full blur-2xl" />
      </div>
      
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 w-full">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2 lg:gap-12">
          
          {/* Content Side */}
          <MotionDiv
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-white space-y-8"
          >
            {/* Premium headline with stagger animation */}
            <div className="space-y-4">
              <MotionH2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
              >
                Book the
              </MotionH2>
              <MotionH2
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="text-4xl md:text-6xl font-bold tracking-tight leading-[1.05]"
              >
                <span className="text-transparent bg-gradient-to-r from-brand-flame via-brand-glow to-brand-flame bg-clip-text animate-gradient-x">
                  Experience
                </span>
              </MotionH2>
            </div>
            
            {/* Enhanced subtitle */}
            <MotionP 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-base md:text-xl font-light text-white/80 leading-relaxed max-w-xl"
            >
              From intimate proposals to festival stages—bring the ride & the music to 
              <span className="text-brand-glow font-medium"> your moment</span>.
            </MotionP>
            
            {/* Premium service showcase */}
            <MotionDiv
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-1 h-8 bg-gradient-to-b from-brand-flame to-brand-glow rounded-full" />
                <h3 className="text-xl font-semibold text-white">What I Offer</h3>
              </div>
              
              <div className="grid grid-cols-2 gap-3 max-w-md">
                {[
                  { title: "Proposals & Weddings", icon: "💍", accent: "from-sky-400 to-blue-400" },
                  { title: "Festivals", icon: "🎵", accent: "from-purple-400 to-blue-400" },
                  { title: "Private Events", icon: "🎉", accent: "from-yellow-400 to-orange-400" },
                  { title: "Brand Collaborations", icon: "✨", accent: "from-green-400 to-teal-400" }
                ].map((service, index) => (
                  <MotionDiv
                    key={service.title}
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    className="group"
                  >
                    <div className="p-2.5 rounded-xl bg-white/5 border border-white/10 backdrop-blur-sm group-hover:bg-white/10 group-hover:border-white/20 transition-all duration-300 cursor-default">
                      <div className="flex items-center gap-2.5">
                        <span className="text-xl">{service.icon}</span>
                        <span className="font-medium text-xs md:text-sm text-white/90 group-hover:text-white transition-colors">
                          {service.title}
                        </span>
                      </div>
                    </div>
                  </MotionDiv>
                ))}
              </div>
            </MotionDiv>
            
            {/* Premium CTA buttons */}
            <MotionDiv
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="space-y-6"
            >
              {/* Primary actions */}
              <div className="flex flex-col sm:flex-row gap-3">
                <Button 
                  size="default"
                  className="group bg-gradient-to-r from-brand-flame to-brand-flame/80 hover:from-brand-flame/90 hover:to-brand-flame text-white font-bold px-6 py-3 text-base rounded-full shadow-2xl hover:shadow-brand-flame/25 transition-all duration-300 transform hover:scale-105"
                  onClick={()=>r.push("/book?intent=event")}
                >
                  <span className="flex items-center gap-3">
                    Book Experience
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M13.5 2c-5.621 0-10.211 4.443-10.475 10h-3.025l5 6.625 5-6.625h-2.975c.257-3.351 3.06-6 6.475-6 3.584 0 6.5 2.916 6.5 6.5s-2.916 6.5-6.5 6.5c-1.863 0-3.542-.793-4.728-2.053l-2.427 3.216c1.877 1.754 4.389 2.837 7.155 2.837 5.79 0 10.5-4.71 10.5-10.5s-4.71-10.5-10.5-10.5z"/>
                    </svg>
                  </span>
                </Button>
                
                <Button 
                  size="default"
                  variant="outline" 
                  className="border-2 border-white/30 text-white hover:bg-white hover:text-black px-6 py-3 text-base rounded-full font-semibold backdrop-blur-sm transition-all duration-300 hover:scale-105"
                  onClick={()=>r.push("/world")}
                >
                  Request My City
                </Button>
              </div>
            </MotionDiv>
          </MotionDiv>
          
          {/* Visual Side - Premium Image Treatment */}
          <MotionDiv
            initial={{ opacity: 0, x: 50, scale: 0.9 }}
            whileInView={{ opacity: 1, x: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="relative"
          >
            <div className="relative group">
              {/* Multiple layered glow effects */}
              <div className="absolute -inset-12 bg-gradient-to-r from-brand-flame/25 via-purple-500/15 to-brand-glow/25 rounded-full blur-3xl opacity-40 group-hover:opacity-60 transition-all duration-1000" />
              <div className="absolute -inset-8 bg-gradient-to-br from-brand-flame/20 to-brand-glow/20 rounded-3xl blur-2xl group-hover:blur-xl transition-all duration-700" />
              <div className="absolute -inset-4 bg-white/5 rounded-3xl group-hover:bg-white/10 transition-all duration-500" />
              
              {/* Main image container */}
              <div className="relative aspect-[4/5] max-h-[70vh] overflow-hidden rounded-3xl shadow-2xl group-hover:shadow-3xl transition-all duration-700">
                <Image 
                  src={imageSrc} 
                  alt="Jeremiah Miller performing" 
                  fill 
                  className="object-cover transition-all duration-1000 group-hover:scale-110 group-hover:rotate-1" 
                  priority 
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
                
                {/* Cinematic overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 group-hover:from-black/40 transition-all duration-500" />
                
                {/* Floating UI elements */}
                <div className="absolute top-6 right-6 flex items-center gap-2 bg-black/50 backdrop-blur-md rounded-full px-4 py-2">
                  <div className="w-2 h-2 bg-brand-flame rounded-full animate-pulse" />
                  <span className="text-white text-sm font-medium">LIVE</span>
                </div>
                
                {/* Bottom accent */}
                <div className="absolute bottom-6 left-6 right-6">
                  <div className="h-1 bg-gradient-to-r from-brand-flame via-brand-glow to-brand-flame rounded-full" />
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -top-4 -left-4 w-8 h-8 bg-brand-glow/80 rounded-full blur-sm animate-pulse" />
              <div className="absolute -bottom-6 -right-6 w-12 h-12 bg-brand-flame/60 rounded-full blur-lg animate-pulse delay-500" />
            </div>
          </MotionDiv>
        </div>
      </div>
    </section>
  );
}