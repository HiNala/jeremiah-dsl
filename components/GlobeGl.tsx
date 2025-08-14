"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import Globe from "react-globe.gl";
import { WORLD_SEED, randomLatLon, type Registration } from "@/lib/geo";

export type GlobeGlProps = {
  initial?: Registration[];
  autoRotate?: boolean;
  maxPoints?: number;
};

const MAX_POINTS_DEFAULT = 3000;

export default function GlobeGl({ initial = WORLD_SEED, autoRotate = true, maxPoints = MAX_POINTS_DEFAULT }: GlobeGlProps) {
  const ref = useRef<ReturnType<typeof Globe> | null>(null);
  const [points, setPoints] = useState<Registration[]>(initial);

  // Mock realtime stream
  useEffect(() => {
    let cancelled = false;
    let handle: number | undefined;
    const tick = () => {
      if (cancelled) return;
      setPoints((prev) => {
        const next = [...prev, randomLatLon()];
        if (next.length > maxPoints) next.splice(0, next.length - maxPoints);
        return next;
      });
      handle = setTimeout(tick, 1500 + Math.random() * 1000) as unknown as number;
    };
    handle = setTimeout(tick, 1200) as unknown as number;
    return () => {
      cancelled = true;
      if (handle) clearTimeout(handle as unknown as number);
    };
  }, [maxPoints]);

  // Textures (graceful fallback)
  const [textures, setTextures] = useState<{ color?: string; bump?: string; night?: string }>({});
  useEffect(() => {
    const check = async (path: string) => (await fetch(path, { method: "HEAD" })).ok ? path : undefined;
    Promise.all([
      check("/textures/earth_8k.jpg"),
      check("/textures/earth_bump_8k.jpg"),
      check("/textures/earth_night_8k.jpg"),
    ]).then(([color, bump, night]) => {
      setTextures({ color, bump, night });
      if (!color) console.info("GlobeGL: textures missing, using default material.");
    });
  }, []);

  const hexConfig = useMemo(() => ({
    radius: 0.6,
    colorRange: ["rgba(255,0,0,0.0)", "rgba(255,0,0,0.35)", "rgba(255,0,0,0.75)"],
    altitudeScale: 0.005,
    resolution: 4,
  }), []);

  return (
    <div className="h-[100dvh] w-full bg-black">
      <Globe
        ref={(g) => (ref.current = g)}
        width={undefined as unknown as number}
        height={undefined as unknown as number}
        backgroundColor="rgba(0,0,0,1)"
        globeImageUrl={textures.color}
        bumpImageUrl={textures.bump}
        // pins
        pointsData={points}
        pointLat={(d: Registration) => d.lat}
        pointLng={(d: Registration) => d.lon}
        pointAltitude={0.01}
        pointRadius={0.3}
        pointColor={() => "#ffcc66"}
        // hexbin heatmap
        hexBinPointLat={(d: Registration) => d.lat}
        hexBinPointLng={(d: Registration) => d.lon}
        hexBinPointsData={points}
        hexBinResolution={hexConfig.resolution}
        hexBinMerge={true}
        hexBinColor={(bins: any) => {
          const n = bins?.length ?? 0;
          if (n <= 1) return hexConfig.colorRange[0];
          if (n <= 3) return hexConfig.colorRange[1];
          return hexConfig.colorRange[2];
        }}
        hexBinAltitude={(bins: any) => (bins?.length ?? 0) * hexConfig.altitudeScale}
        // controls
        animateIn={false}
        onGlobeReady={() => {
          try {
            const controls = ref.current?.controls();
            if (controls && autoRotate) {
              controls.autoRotate = true;
              controls.autoRotateSpeed = 0.4;
              controls.enablePan = false;
              controls.minDistance = 150;
              controls.maxDistance = 450;
            }
          } catch {}
        }}
      />
    </div>
  );
}


