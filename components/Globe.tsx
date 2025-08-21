"use client";

import * as THREE from "three";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { latLonToVector3 } from "@/lib/geo";
import { addSplat, createHeatmapCanvas } from "@/lib/heatmap";
import { createHeatOverlay } from "@/lib/heatOverlay";
import { demoFans, type CityFan } from "@/data/fans";
import fansToPoints from "@/lib/fansToPoints";
import createCityBars from "@/lib/cityBars";
import HeatOverlayControls from "@/components/HeatOverlayControls";

export type Registration = { lat: number; lon: number };
export type GlobeProps = {
  pins: Registration[];
  heatmapPoints: Registration[];
  autoRotate?: boolean;
};

type EarthProps = {
  heatmap: THREE.DataTexture | null;
  colorMap: THREE.Texture | null;
  normalMap: THREE.Texture | null;
};

const Earth = React.forwardRef<THREE.Mesh, EarthProps>(function Earth(
  { heatmap, colorMap, normalMap }: EarthProps,
  sphereRef
) {

  // Custom shader that multiplies color map by heatmap intensity
  const uniforms = useMemo(() => ({
    uColorMap: { value: colorMap },
    uHeatmap: { value: heatmap },
    uHeatStrength: { value: 0.7 },
    uHasColorMap: { value: Boolean(colorMap) },
  }), [colorMap, heatmap]);

  useEffect(() => {
    uniforms.uColorMap.value = colorMap;
    uniforms.uHeatmap.value = heatmap;
    uniforms.uHasColorMap.value = Boolean(colorMap);
  }, [colorMap, heatmap, uniforms]);

  const vertex = /* glsl */`
    varying vec2 vUv;
    varying vec3 vNormalW;
    void main() {
      vUv = uv;
      vNormalW = normalize(normalMatrix * normal);
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  const fragment = /* glsl */`
    uniform sampler2D uColorMap;
    uniform sampler2D uHeatmap;
    uniform float uHeatStrength;
    uniform bool uHasColorMap;
    varying vec2 vUv;
    varying vec3 vNormalW;

    void main() {
      vec3 base = vec3(0.3, 0.45, 0.65);
      if (uHasColorMap) {
        base = texture2D(uColorMap, vUv).rgb;
      }
      float heat = texture2D(uHeatmap, vUv).r;
      vec3 color = base * (1.0 + heat * uHeatStrength);
      gl_FragColor = vec4(color, 1.0);
    }
  `;

  // If no colorMap available, fallback to standard lambert to remain robust
  if (!colorMap) {
    return (
      <mesh ref={sphereRef as React.RefObject<THREE.Mesh>} frustumCulled={false}>
        <sphereGeometry args={[1, 128, 128]} />
        <meshLambertMaterial color={new THREE.Color(0.25, 0.35, 0.5)} />
      </mesh>
    );
  }

  return (
    <mesh ref={sphereRef as React.RefObject<THREE.Mesh>} frustumCulled={false}>
      <sphereGeometry args={[1, 128, 128]} />
      <shaderMaterial
        key={String(Boolean(colorMap)) + String(Boolean(heatmap))}
        uniforms={uniforms}
        vertexShader={vertex}
        fragmentShader={fragment}
      />
      {normalMap ? <meshStandardMaterial attach="material-1" normalMap={normalMap} /> : null}
    </mesh>
  );
});

function Pins({ pins }: { pins: Registration[] }) {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  // Reuse a typed array buffer for matrices and only mark needsUpdate when pins change
  const matricesRef = useRef<THREE.Matrix4[] | null>(null);

  const recomputeMatrices = useCallback((input: Registration[]) => {
    const max = Math.min(input.length, 20000);
    const up = new THREE.Vector3(0, 1, 0);
    const next: THREE.Matrix4[] = new Array(max);
    for (let i = 0; i < max; i++) {
      const { lat, lon } = input[i];
      const pos = latLonToVector3(lat, lon, 1).multiplyScalar(1.01);
      const dir = pos.clone().normalize();
      const q = new THREE.Quaternion().setFromUnitVectors(up, dir);
      const s = new THREE.Vector3(0.008, 0.02, 0.008);
      const m = new THREE.Matrix4();
      m.compose(pos, q, s);
      next[i] = m;
    }
    matricesRef.current = next;
  }, []);

  useEffect(() => {
    recomputeMatrices(pins);
    const mesh = meshRef.current;
    if (!mesh || !matricesRef.current) return;
    const matrices = matricesRef.current;
    const count = matrices.length;
    mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);
    mesh.count = count;
    for (let i = 0; i < count; i++) mesh.setMatrixAt(i, matrices[i]);
    mesh.instanceMatrix.needsUpdate = true;
  }, [pins, recomputeMatrices]);

  return (
    <instancedMesh ref={meshRef} args={[undefined as unknown as THREE.BufferGeometry, undefined as unknown as THREE.Material, Math.max(1, matricesRef.current?.length || 1)]} frustumCulled={false}>
      <coneGeometry args={[0.02, 0.1, 8]} />
      <meshStandardMaterial color="#ffcc66" emissive="#331a00" />
    </instancedMesh>
  );
}

function useHeatmapTexture(points: Registration[]) {
  const [{ canvas, ctx }] = useState(() => createHeatmapCanvas({ width: 1024, height: 512 }));
  const textureRef = useRef<THREE.DataTexture | null>(null);
  const processedRef = useRef(0);

  const ensureTexture = useCallback(() => {
    if (!ctx) return null;
    if (!textureRef.current) {
      const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      const tex = new THREE.DataTexture(img.data, img.width, img.height, THREE.RGBAFormat);
      tex.needsUpdate = true;
      tex.wrapS = THREE.ClampToEdgeWrapping;
      tex.wrapT = THREE.ClampToEdgeWrapping;
      tex.minFilter = THREE.LinearFilter;
      tex.magFilter = THREE.LinearFilter;
      textureRef.current = tex;
    }
    return textureRef.current;
  }, [ctx]);

  // Initial draw
  useEffect(() => {
    if (!ctx) return;
    for (let i = 0; i < points.length; i++) {
      const p = points[i];
      addSplat(ctx, p.lat, p.lon, { radius: 18, intensity: 1 });
    }
    processedRef.current = points.length;
    const tex = ensureTexture();
    if (tex && ctx) {
      const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
      (tex.image as any).data.set(img.data);
      tex.needsUpdate = true;
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Incremental updates when new points are appended
  useEffect(() => {
    if (!ctx) return;
    for (let i = processedRef.current; i < points.length; i++) {
      const p = points[i];
      addSplat(ctx, p.lat, p.lon, { radius: 18, intensity: 1 });
    }
    if (points.length !== processedRef.current) {
      processedRef.current = points.length;
      const tex = ensureTexture();
      if (tex && ctx) {
        const img = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
        (tex.image as any).data.set(img.data);
        tex.needsUpdate = true;
      }
    }
  }, [points, ctx, ensureTexture]);

  return textureRef.current;
}

function useEarthTextures(maxAniso: number) {
  const [color, setColor] = useState<THREE.Texture | null>(null);
  const [normal, setNormal] = useState<THREE.Texture | null>(null);
  const loggedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const loader = new THREE.TextureLoader();
    // Check existence to avoid loader throwing on 404
    fetch("/textures/earth_8k.jpg", { method: "HEAD" }).then((res) => {
      if (!res.ok) {
        if (!loggedRef.current) {
          console.info("Globe: color texture not found, using fallback material.");
          loggedRef.current = true;
        }
        return;
      }
      loader.load(
        "/textures/earth_8k.jpg",
        (tex) => {
          if (!cancelled) {
            tex.colorSpace = THREE.SRGBColorSpace;
            tex.anisotropy = Math.min(8, maxAniso || 1);
            tex.minFilter = THREE.LinearMipmapLinearFilter;
            tex.magFilter = THREE.LinearFilter;
            setColor(tex);
          }
        },
        undefined,
        () => {}
      );
    });
    fetch("/textures/earth_normal_8k.jpg", { method: "HEAD" }).then((res) => {
      if (!res.ok || cancelled) return;
      loader.load(
        "/textures/earth_normal_8k.jpg",
        (tex) => {
          if (!cancelled) setNormal(tex);
        },
        undefined,
        () => {}
      );
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return { color, normal } as const;
}

function SceneContent({ pins, heatmapPoints, autoRotate }: GlobeProps) {
  const groupRef = useRef<THREE.Group>(null);
  const earthRef = useRef<THREE.Mesh>(null);
  const heatmap = useHeatmapTexture(heatmapPoints);
  const { gl, camera } = useThree();
  const maxAniso = gl.capabilities.getMaxAnisotropy?.() ?? 1;
  const { color, normal } = useEarthTextures(maxAniso);
  const overlayRef = useRef<ReturnType<typeof createHeatOverlay> | null>(null);
  const barsRef = useRef<ReturnType<typeof createCityBars> | null>(null);

  // Auto-rotate when idle, pause if controls are active

  useEffect(() => {
    gl.setClearColor(0x0b0b0c, 1);
  }, [gl]);

  // Initial orientation: center on North America
  useEffect(() => {
    if (!groupRef.current) return;
    // Rotate so longitude ~ -100°, latitude ~ 20° faces the camera
    groupRef.current.rotation.set(
      THREE.MathUtils.degToRad(10),
      THREE.MathUtils.degToRad(100),
      0
    );
  }, []);

  useFrame((state, delta) => {
    if (autoRotate && groupRef.current) {
      groupRef.current.rotation.y += delta * 0.1;
    }
  });

  // Initialize heat overlay on top of earth once we have the mesh
  useEffect(() => {
    if (!groupRef.current || overlayRef.current) return;
    const earth = earthRef.current;
    if (!earth) return;
    const geom = earth.geometry as THREE.SphereGeometry;
    // Attempt to detect radius from geometry parameters (fallback 1)
    const radius: number = (geom as any)?.parameters?.radius ?? 1;
    const overlay = createHeatOverlay({ radius, sigmaDeg: 3, heightScale: 0.08 });
    overlay.mesh.renderOrder = (earth.renderOrder || 0) + 1;
    groupRef.current.add(overlay.mesh);
    overlayRef.current = overlay;
    overlayHandle = overlay;
    // Seed with demo data
    overlay.setPoints(fansToPoints(demoFans));

    // Bind updater
    updateFans = (newFans: CityFan[]) => {
      const { mergeFans } = require("@/lib/fansToPoints");
      const merged = mergeFans(newFans);
      const pts = (require("@/lib/fansToPoints").default as typeof import("@/lib/fansToPoints").default)(merged);
      overlay.setPoints(pts);
    };

    // Bars mode setup
    const bars = createCityBars(radius, 0.35);
    bars.mesh.renderOrder = (earth.renderOrder || 0) + 1;
    bars.mesh.visible = false;
    groupRef.current.add(bars.mesh);
    bars.setPoints(fansToPoints(demoFans));
    barsRef.current = bars;
  }, [color]);

  return (
    <group ref={groupRef}>
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 3, 5]} intensity={1.2} />
      <Earth ref={earthRef} heatmap={heatmap} colorMap={color} normalMap={normal} />
      <Pins pins={pins} />
      <HeatOverlayControls
        getOverlay={() => overlayRef.current}
        getBars={() => barsRef.current}
      />
    </group>
  );
}

export default function GlobeCanvas({ pins, heatmapPoints, autoRotate = true }: GlobeProps) {
  const isInteractingRef = useRef(false);
  
  return (
    <Canvas camera={{ position: [0, 0, 3.8], fov: 45 }} dpr={[1, 2]}>
      <SceneContent pins={pins} heatmapPoints={heatmapPoints} autoRotate={autoRotate} />
      <OrbitControls
        enablePan={false}
        minDistance={2.5}
        maxDistance={6}
        onStart={() => (isInteractingRef.current = true)}
        onEnd={() => (isInteractingRef.current = false)}
      />
    </Canvas>
  );
}

// Exposed function to update fans from anywhere (e.g., form submit)
export let updateFans: (newFans: CityFan[]) => void = () => {};

// Bind updateFans to the overlay instance when SceneContent mounts
let overlayHandle: ReturnType<typeof createHeatOverlay> | null = null;
updateFans = (newFans: CityFan[]) => {
  try {
    if (!overlayHandle) return;
    const { mergeFans } = require("@/lib/fansToPoints");
    const merged = mergeFans(newFans);
    const pts = (require("@/lib/fansToPoints").default as typeof import("@/lib/fansToPoints").default)(merged);
    overlayHandle.setPoints(pts);
  } catch {
    // no-op; keep robust in SSR/build
  }
};


