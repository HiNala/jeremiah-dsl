"use client";

import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { createHeatmapCanvas, addSplat } from "@/lib/heatmap";
import GlobeVanilla from "globe.gl";
import { WORLD_SEED, randomLatLon, type Registration } from "@/lib/geo";

// Dynamic import to avoid SSR "window is not defined" from three-globe/react-globe.gl
const Globe = dynamic(() => import("react-globe.gl"), { ssr: false });

export type GlobeGlProps = {
  initial?: Registration[];
  autoRotate?: boolean;
  maxPoints?: number;
};

const MAX_POINTS_DEFAULT = 3000;

export default function GlobeGl({ initial = WORLD_SEED, autoRotate = true, maxPoints = MAX_POINTS_DEFAULT }: GlobeGlProps) {
  const ref = useRef<any>(null);
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
  const [textures, setTextures] = useState<{ color?: string; bump?: string; night?: string; star?: string }>({});
  useEffect(() => {
    const check = async (path: string) => (await fetch(path, { method: "HEAD" })).ok ? path : undefined;
    Promise.all([
      check("/textures/earth_8k.jpg"),
      check("/textures/earth_bump_8k.jpg"),
      check("/textures/earth_night_8k.jpg"),
      check("/textures/starmap_8k.jpg"),
    ]).then(([color, bump, night, star]) => {
      setTextures({ color, bump, night, star });
      if (!color) console.info("GlobeGL: textures missing, using default material.");
    });
  }, []);

  // Ensure bump is applied even if the prop isn't picked up immediately
  useEffect(() => {
    const mat: any = ref.current?.globeMaterial?.();
    if (!mat) return;
    if (textures.bump) {
      // Ensure bump map is treated as height data (no color space) and scale it up
      if (mat.bumpMap) {
        mat.bumpMap.colorSpace = THREE.NoColorSpace as any;
        mat.bumpMap.needsUpdate = true;
      }
      mat.bumpScale = 1.1;
    }
    // Slight specular to accent oceans (MeshPhongMaterial)
    if ("specular" in mat) {
      mat.specular = new THREE.Color(0x101010);
      mat.shininess = 10;
    }
    mat.needsUpdate = true;
  }, [textures]);

  const hexConfig = useMemo(() => ({
    radius: 0.6,
    colorRange: ["rgba(255,0,0,0.0)", "rgba(255,0,0,0.35)", "rgba(255,0,0,0.75)"],
    altitudeScale: 0.005,
    resolution: 4,
  }), []);

  // Use the user's bump image as the base color texture if present
  const baseTexture = textures.bump ?? textures.color;
  const useSeparateBump = Boolean(textures.bump && textures.color === undefined);
  const showPins = false; // hide pins per request; hexbin heatmap will still render
  const useShaderOverlay = false; // rely on library heatmap for now

  // Major cities to label
  const cities = useMemo(
    () => [
      { name: "San Francisco", lat: 37.7749, lon: -122.4194 },
      { name: "Los Angeles", lat: 34.0522, lon: -118.2437 },
      { name: "New York", lat: 40.7128, lon: -74.006 },
      { name: "Mexico City", lat: 19.4326, lon: -99.1332 },
      { name: "São Paulo", lat: -23.5505, lon: -46.6333 },
      { name: "Buenos Aires", lat: -34.6037, lon: -58.3816 },
      { name: "London", lat: 51.5074, lon: -0.1278 },
      { name: "Paris", lat: 48.8566, lon: 2.3522 },
      { name: "Berlin", lat: 52.52, lon: 13.405 },
      { name: "Cairo", lat: 30.0444, lon: 31.2357 },
      { name: "Nairobi", lat: -1.2921, lon: 36.8219 },
      { name: "Lagos", lat: 6.5244, lon: 3.3792 },
      { name: "Delhi", lat: 28.6139, lon: 77.209 },
      { name: "Tokyo", lat: 35.6762, lon: 139.6503 },
      { name: "Shanghai", lat: 31.2304, lon: 121.4737 },
      { name: "Singapore", lat: 1.3521, lon: 103.8198 },
      { name: "Sydney", lat: -33.8688, lon: 151.2093 },
    ],
    []
  );

  // Build heatmap points to emulate the globe.gl heatmap example
  const heatmapPoints = useMemo(() => {
    const pts: Array<{ lat: number; lon: number; weight: number }> = [];
    const jitter = (amt: number) => (Math.random() * 2 - 1) * amt;
    const clusters = cities.map((c) => ({ ...c, count: 600 }));
    for (const c of clusters) {
      for (let i = 0; i < c.count; i++) {
        pts.push({ lat: c.lat + jitter(1.5), lon: c.lon + jitter(1.5), weight: Math.random() });
      }
    }
    return pts;
  }, [cities]);

  // Build a soft organic heatmap mask centered on cities
  const heatmapTexRef = useRef<THREE.DataTexture | null>(null);
  const [heatReady, setHeatReady] = useState(false);
  useEffect(() => {
    const { canvas, ctx } = createHeatmapCanvas({ width: 1024, height: 512 });
    if (!ctx) return;
    // Stronger, multi-radius splats for an obvious heat effect
    for (const c of cities) {
      addSplat(ctx, c.lat, c.lon, { radius: 80, intensity: 1.0 });
      addSplat(ctx, c.lat, c.lon, { radius: 45, intensity: 1.0 });
      addSplat(ctx, c.lat, c.lon, { radius: 120, intensity: 0.6 });
    }
    const img = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const tex = new THREE.DataTexture(img.data, img.width, img.height, THREE.RGBAFormat);
    tex.needsUpdate = true;
    tex.wrapS = tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    heatmapTexRef.current = tex;
    setHeatReady(true);
  }, [cities]);

  const recompileWithOverlays = (mat: THREE.MeshPhongMaterial) => {
    if (!useShaderOverlay) return;
    const heat = heatmapTexRef.current;
    const underColorUrl = textures.color;
    const usingBumpAsBase = textures.color && textures.bump && baseTexture === textures.bump;
    mat.onBeforeCompile = (shader) => {
      if (usingBumpAsBase && underColorUrl) {
        const loader = new THREE.TextureLoader();
        const t = loader.load(underColorUrl);
        t.colorSpace = THREE.SRGBColorSpace;
        t.wrapS = t.wrapT = THREE.ClampToEdgeWrapping;
        shader.uniforms.uUnderMap = { value: t } as any;
        shader.uniforms.uUnderOpacity = { value: 0.35 } as any;
      }
      if (heat) {
        shader.uniforms.uHeatMap = { value: heat } as any;
        shader.uniforms.uHeatStrength = { value: 2.0 } as any;
        shader.uniforms.uC1 = { value: new THREE.Color(0x0b3cfc) } as any; // blue
        shader.uniforms.uC2 = { value: new THREE.Color(0x38bdf8) } as any; // cyan
        shader.uniforms.uC3 = { value: new THREE.Color(0xfbbf24) } as any; // amber
        shader.uniforms.uC4 = { value: new THREE.Color(0xff2d00) } as any; // red
      }
      shader.fragmentShader = shader.fragmentShader.replace(
        '#include <map_fragment>',
        `#include <map_fragment>\n\n        ${usingBumpAsBase ? 'vec4 underColor = texture2D(uUnderMap, vUv); underColor = mapTexelToLinear(underColor); diffuseColor.rgb = mix(diffuseColor.rgb, underColor.rgb, uUnderOpacity);' : ''}\n        ${heat ? 'vec4 heat = texture2D(uHeatMap, vUv); float h = clamp(heat.r * uHeatStrength, 0.0, 1.0); vec3 grad = mix(uC1, uC2, smoothstep(0.0, 0.33, h)); grad = mix(grad, uC3, smoothstep(0.33, 0.66, h)); grad = mix(grad, uC4, smoothstep(0.66, 1.0, h)); diffuseColor.rgb = mix(diffuseColor.rgb, grad, clamp(h,0.0,1.0));' : ''}\n      `
      );
    };
    mat.needsUpdate = true;
  };

  // Recompile overlays once heatmap or textures are ready
  useEffect(() => {
    if (!heatReady) return;
    const mat = ref.current?.globeMaterial?.() as THREE.MeshPhongMaterial | undefined;
    if (mat) recompileWithOverlays(mat);
  }, [heatReady, textures, baseTexture, useSeparateBump]);

  return (
    <div className="h-[100dvh] w-full bg-black">
      <Globe
        ref={(g) => (ref.current = g)}
        width={undefined as unknown as number}
        height={undefined as unknown as number}
        backgroundColor={textures.star ? undefined as unknown as string : "rgba(0,0,0,1)"}
        backgroundImageUrl={textures.star}
        globeImageUrl={baseTexture}
        bumpImageUrl={useSeparateBump ? textures.bump : undefined}
        bumpScale={useSeparateBump ? 1.3 : 0}
        showAtmosphere
        atmosphereAltitude={0.18}
        // pins (disabled)
        pointsData={showPins ? points : []}
        pointLat={(d: Registration) => d.lat}
        pointLng={(d: Registration) => d.lon}
        pointAltitude={0.0}
        pointRadius={0}
        pointColor={() => "#ffcc66"}
        // hexbin heatmap disabled: use dedicated heatmap layer instead
        hexBinPointLat={(d: Registration) => d.lat}
        hexBinPointLng={(d: Registration) => d.lon}
        hexBinPointsData={[]}
        hexBinResolution={5}
        hexBinMerge={true}
        hexBinColor={() => 'rgba(0,0,0,0)'}
        hexBinAltitude={() => 0}
        // heatmap (react-globe.gl)
        heatmapPointsData={heatmapPoints as any}
        heatmapPointLat={(d: any) => d.lat}
        heatmapPointLng={(d: any) => d.lon}
        heatmapPointWeight={(d: any) => d.weight}
        heatmapColorScale={["#021435", "#0b3cfc", "#33e1ed", "#fbbf24", "#ff2d00"]}
        heatmapAltitude={1.1}
        heatmapRadius={28}
        // also support alt prop names used in some builds
        heatmapData={heatmapPoints as any}
        // city labels
        labelsData={cities}
        labelLat={(d: any) => d.lat}
        labelLng={(d: any) => d.lon}
        labelText={(d: any) => d.name}
        labelSize={1.8}
        labelDotRadius={0.15}
        labelColor={() => "#ffffff"}
        labelAltitude={0.01}
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
            // Start centered on the Americas
            ref.current?.pointOfView({ lat: 20, lng: -90, altitude: 2.2 }, 1200);
            // Double-assure material bump & overlay blend when ready
            const mat = ref.current?.globeMaterial?.() as THREE.MeshPhongMaterial | undefined;
            if (mat) {
              if (useSeparateBump) mat.bumpScale = 1.3;
              if (useShaderOverlay) recompileWithOverlays(mat);
            }
          } catch {}
        }}
      />
    </div>
  );
}


