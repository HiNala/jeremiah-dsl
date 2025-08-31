"use client";

import { useEffect, useState } from "react";
import GlobeGl from "@/components/GlobeGl";
import { WORLD_SEED } from "@/lib/geo";
import { useRealTimeVotes } from "@/hooks/useRealTimeVotes";

// Simple geocoding for major cities (replace with real geocoding service)
const CITY_COORDS: Record<string, { lat: number; lon: number }> = {
  "Los Angeles": { lat: 34.0522, lon: -118.2437 },
  "San Francisco": { lat: 37.7749, lon: -122.4194 },
  "New York": { lat: 40.7128, lon: -74.006 },
  "Mexico City": { lat: 19.4326, lon: -99.1332 },
  "Austin": { lat: 30.2672, lon: -97.7431 },
  "London": { lat: 51.5074, lon: -0.1278 },
  "Paris": { lat: 48.8566, lon: 2.3522 },
  "Tokyo": { lat: 35.6762, lon: 139.6503 },
  "Sydney": { lat: -33.8688, lon: 151.2093 },
  "Toronto": { lat: 43.6532, lon: -79.3832 },
  "Berlin": { lat: 52.52, lon: 13.405 },
  // Add more cities as needed
};

export default function GlobePage() {
  const [cities, setCities] = useState<{ name: string; votes: number }[]>([]);
  const [globePoints, setGlobePoints] = useState(WORLD_SEED);

  // Load cities from API
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/votes", { cache: "no-store" });
        const data = (await res.json()) as { cities?: { name: string; votes: number }[] };
        if (mounted && data?.cities) {
          setCities(data.cities);
          // Convert cities to globe points
          const points = data.cities
            .filter(city => CITY_COORDS[city.name])
            .map(city => ({
              lat: CITY_COORDS[city.name].lat,
              lon: CITY_COORDS[city.name].lon,
              intensity: Math.min(city.votes / 100, 10) // Scale intensity
            }));
          setGlobePoints([...WORLD_SEED, ...points]);
        }
      } catch {}
    })();
    return () => { mounted = false; };
  }, []);

  // Real-time updates
  const handleRealTimeUpdate = (update: { city: string; votes: number }) => {
    setCities(prev => {
      const updated = [...prev];
      const index = updated.findIndex(c => c.name === update.city);
      if (index >= 0) {
        updated[index] = { ...updated[index], votes: update.votes };
      } else {
        updated.push({ name: update.city, votes: update.votes });
      }
      
      // Update globe points
      const points = updated
        .filter(city => CITY_COORDS[city.name])
        .map(city => ({
          lat: CITY_COORDS[city.name].lat,
          lon: CITY_COORDS[city.name].lon,
          intensity: Math.min(city.votes / 100, 10)
        }));
      setGlobePoints([...WORLD_SEED, ...points]);
      
      return updated;
    });
  };

  useRealTimeVotes(handleRealTimeUpdate);

  return (
    <div className="relative h-screen overflow-hidden bg-black">
      <GlobeGl initial={globePoints} autoRotate />
      
      {/* Overlay UI */}
      <div className="absolute top-6 left-6 z-10">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg p-4 border border-white/10">
          <h2 className="text-white font-bold text-lg mb-2">Tour Demand</h2>
          <p className="text-white/70 text-sm mb-3">
            Cities glowing brighter have more votes
          </p>
          <div className="space-y-1">
            {cities.slice(0, 5).map((city, i) => (
              <div key={city.name} className="flex justify-between text-sm">
                <span className="text-white/80">{i + 1}. {city.name}</span>
                <span className="text-brand-flame font-medium">{city.votes}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}


