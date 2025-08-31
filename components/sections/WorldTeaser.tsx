"use client";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import VoteModal, { type VoteModalMode } from "@/components/VoteModal";
import { div as MotionDiv, li as MotionLi, h2 as MotionH2 } from "framer-motion/client";
import { useRealTimeVotes } from "@/hooks/useRealTimeVotes";
import AnimatedCounter from "@/components/AnimatedCounter";

// Background uses the same light sky gradient and subtle grain as FeaturedVideos

export default function WorldTeaser({
  topCities = ["Los Angeles","San Francisco","New York","Mexico City","Austin"],
}: { topCities?: string[] }) {
  
  // Deterministic votes to avoid hydration mismatches
  const seededVotesForCity = (name: string, index: number): number => {
    const input = `${name}-${index}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 1000) + 500; // 500..1499
  };
  
  // Local votes state so clicking can increment a city's votes (client-only)
  const [votes, setVotes] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    topCities.forEach((name, i) => { initial[name] = seededVotesForCity(name, i); });
    return initial;
  });

  // Modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<VoteModalMode>("vote");
  const [selectedCity, setSelectedCity] = useState<string | undefined>(undefined);

  // Load cities from API on mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/votes", { cache: "no-store" });
        const data = (await res.json()) as { cities?: { name: string; votes: number }[] };
        if (mounted && data?.cities) {
          const map: Record<string, number> = {};
          for (const c of data.cities) map[c.name] = c.votes;
          setVotes(map);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  const openVoteFor = (city: string) => {
    setSelectedCity(city);
    setModalMode("vote");
    setModalOpen(true);
  };

  const openRequest = () => {
    setSelectedCity(undefined);
    setModalMode("request");
    setModalOpen(true);
  };

  const applyServerCities = useCallback((cities: { name: string; votes: number }[]) => {
    const map: Record<string, number> = {};
    for (const c of cities) map[c.name] = c.votes;
    setVotes(map);
  }, []);

  // Real-time vote updates
  const handleRealTimeUpdate = useCallback((update: { type: string; city: string; votes: number }) => {
    setVotes(prev => ({ ...prev, [update.city]: update.votes }));
  }, []);

  const { connected } = useRealTimeVotes(handleRealTimeUpdate);

  const incrementCity = (city: string) => {
    setVotes(prev => ({ ...prev, [city]: (prev[city] ?? 0) + 1 }));
  };

  const handleRequestCity = () => {
    if (typeof window !== 'undefined') {
      window.location.assign("/world");
    }
  };

  return (
    <section className="relative h-screen py-8 md:py-12 overflow-hidden">
      {/* Background image (provided) */}
      <div className="absolute inset-0 bg-[#F4EAD8]" aria-hidden>
        <Image
          src={require("../../img/ChatGPT Image Aug 27, 2025, 10_01_49 PM.png")}
          alt=""
          fill
          priority
          className="object-cover md:object-contain object-center"
        />
      </div>
      {/* Very subtle vignette for readability */}
      <div className="absolute inset-0 bg-black/10 [mask-image:radial-gradient(120%_120%_at_50%_40%,black,transparent_70%)]" aria-hidden />
      
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10 h-full flex items-center">
        <div className="grid gap-6 lg:grid-cols-12 lg:gap-8 items-center w-full">
          
          {/* Content Side */}
          <div className="lg:col-span-6 space-y-4">
            <MotionDiv
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="rounded-2xl bg-white/70 backdrop-blur-md border border-black/10 p-4 md:p-6 shadow-[0_10px_40px_rgba(0,0,0,0.15)]"
            >
              {/* Section badge */}
              <div className="inline-flex items-center gap-2 bg-black/5 border border-black/10 rounded-full px-4 py-1.5 mb-4">
                <div className="w-2 h-2 bg-brand-flame rounded-full" />
                <span className="text-black/70 text-xs font-semibold tracking-wide">GLOBAL TOUR</span>
              </div>

              {/* Premium headline */}
              <MotionH2 className="text-4xl md:text-5xl font-bold text-black mb-2 tracking-tight leading-[1.05]">
                Where should I go
                <br />
                <span className="text-brand-flame">next?</span>
              </MotionH2>
              
              {/* Enhanced subtitle */}
              <p className="text-sm md:text-base text-black/70 mb-4 leading-relaxed max-w-lg">
                Request your city—get friends to vote. <span className="font-semibold text-black/80">The hottest map wins.</span>
              </p>

              {/* Features list */}
              <div className="space-y-2 mb-3">
                {[
                  { icon: "🗳️", text: "Community voting system" },
                  { icon: "🔥", text: "Real-time heat tracking" },
                  { icon: "🌍", text: "Global leaderboard" }
                ].map((feature, index) => (
                  <MotionDiv
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 text-black/70"
                  >
                    <span className="text-lg">{feature.icon}</span>
                    <span className="font-medium text-sm">{feature.text}</span>
                  </MotionDiv>
                ))}
              </div>
              
              {/* Premium CTA */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  size="sm"
                  className="group bg-brand-flame hover:bg-brand-flame/90 text-white font-semibold px-6 py-2 text-sm rounded-full shadow-lg transition-all duration-200" 
                  onClick={handleRequestCity}
                >
                  <span className="flex items-center gap-2">
                    Request My City
                    <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </span>
                </Button>
              </MotionDiv>
            </MotionDiv>
          </div>
          
          {/* Premium Leaderboard */}
          <div className="lg:col-span-6">
            <MotionDiv 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative md:ml-8 lg:ml-12 xl:ml-16"
            >
              {/* Leaderboard container */}
              <div className="relative">
                <div className="relative overflow-hidden rounded-2xl border border-black/10 bg-white/70 backdrop-blur-md shadow-[0_10px_40px_rgba(0,0,0,0.12)]">
                  {/* Header */}
                  <div className="p-3 md:p-4 border-b border-black/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-flame rounded-full" />
                        <h3 className="text-base md:text-lg font-bold text-black">Top Cities</h3>
                      </div>
                      <div className={`flex items-center gap-2 rounded-full px-2 py-0.5 ${
                        connected ? 'bg-green-500/10' : 'bg-orange-500/10'
                      }`}>
                        <div className={`w-2 h-2 rounded-full ${
                          connected ? 'bg-green-500 animate-pulse' : 'bg-orange-500'
                        }`} />
                        <span className={`text-sm font-medium ${
                          connected ? 'text-green-700' : 'text-orange-700'
                        }`}>
                          {connected ? 'LIVE' : 'CONNECTING'}
                        </span>
                      </div>
                    </div>
                    <p className="text-black/50 text-xs">Voting updates every 24 hours</p>
                  </div>
                  
                  {/* Cities list */}
                  <div className="p-3 md:p-4">
                    <div className="space-y-2">
                      {topCities.map((city, index) => {
                        const maxVotes = Math.max(...topCities.map(c => votes[c] ?? 1));
                        const cityVotes = votes[city] ?? 0;
                        const percentage = Math.max(5, Math.round((cityVotes / maxVotes) * 100));
                        const isTop3 = index < 3;
                        
                        return (
                          <MotionLi 
                            key={city} 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                            className="group relative"
                          >
                            <div
                              className={`select-none flex items-center justify-between p-3 rounded-xl transition-colors duration-200 border ${
                                isTop3 
                                  ? 'bg-white/80 border-black/10' 
                                  : 'bg-white/60 hover:bg-white/70 border-black/10'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                {/* Rank with special styling for top 3 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                  index === 0 ? 'bg-yellow-500 text-black' :
                                  index === 1 ? 'bg-gray-400 text-black' :
                                  index === 2 ? 'bg-amber-600 text-white' :
                                  'bg-black/10 text-black'
                                }`}>
                                  {index + 1}
                                </div>
                                
                                <div>
                                  <h4 className={`text-sm md:text-base font-semibold transition-colors ${
                                    isTop3 ? 'text-black' : 'text-black'
                                  }`}>
                                    {city}
                                  </h4>
                                  <p className="text-black/50 text-xs">
                                    <AnimatedCounter value={cityVotes} /> votes
                                  </p>
                                </div>
                              </div>
                              
                              {/* Enhanced progress bar + vote button */}
                              <div className="flex items-center gap-3">
                                <div className="w-20 md:w-24 h-2 rounded-full bg-black/10 overflow-hidden">
                                  <MotionDiv 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                      duration: 1.2, 
                                      delay: 1.2 + index * 0.1, 
                                      ease: "easeOut" 
                                    }}
                                    className={`h-2 rounded-full ${
                                      isTop3 
                                        ? 'bg-brand-flame' 
                                        : 'bg-black/30'
                                    }`}
                                  />
                                </div>
                                <span className={`text-xs font-medium min-w-[2.5rem] ${
                                  isTop3 ? 'text-brand-flame' : 'text-black'
                                }`}>
                                  {percentage}%
                                </span>
                                <Button size="sm" className="ml-1 bg-brand-flame text-white hover:bg-brand-flame/90 text-xs px-3 py-1" onClick={() => openVoteFor(city)}>
                                  VOTE
                                </Button>
                              </div>
                            </div>
                          </MotionLi>
                        );
                      })}
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-4 pt-3 border-t border-black/10 text-center">
                                            <p className="text-black/50 text-xs mb-2">
                        🔥 Live heat + full leaderboard on the World page
                      </p>
                      <div className="flex gap-2 justify-center text-xs">
                        <button 
                          onClick={openRequest}
                          className="text-brand-flame hover:text-brand-flame/80 font-medium transition-colors duration-200 underline underline-offset-2"
                        >
                          Add your city
                        </button>
                        <span className="text-black/30">•</span>
                        <button 
                          onClick={handleRequestCity}
                          className="text-brand-flame hover:text-brand-flame/80 font-medium transition-colors duration-200 underline underline-offset-2"
                        >
                          View Global Map →
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
      <VoteModal open={modalOpen} mode={modalMode} city={selectedCity} onClose={() => setModalOpen(false)} onSuccess={applyServerCities} />
      {/* Removed clouds/texture CSS */}
    </section>
  );
}