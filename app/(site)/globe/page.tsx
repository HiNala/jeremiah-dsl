"use client";

/**
 * Demo globe page (react-globe.gl version)
 * - Uses NASA 8K textures when present, and falls back gracefully otherwise.
 * - Mock realtime emits random lat/lon every ~1.5–2.5s; cap MAX_POINTS for perf.
 * - To switch to Supabase, replace the mock in a future data layer; UI stays the same.
 * - For server inserts, POST to `/api/registrations` with { lat, lon, name?, email?, city?, country? }.
 */

import GlobeGl from "@/components/GlobeGl";
import { WORLD_SEED } from "@/lib/geo";

export default function GlobePage() {
  return (
    <div className="overflow-hidden">
      <GlobeGl initial={WORLD_SEED} autoRotate />
    </div>
  );
}


