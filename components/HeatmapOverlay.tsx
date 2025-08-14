"use client";

import { useMemo } from "react";
import * as THREE from "three";
import { useHeatmapStore } from "@/stores/useHeatmapStore";
import { latLngToVector3 } from "@/lib/utils";

export default function HeatmapOverlay() {
  const points = useHeatmapStore((s) => s.points);
  const size = points.length;

  const { positions, colors } = useMemo(() => {
    const positionsArray = new Float32Array(size * 3);
    const colorsArray = new Float32Array(size * 3);
    points.forEach((p, i) => {
      const v = latLngToVector3(p.lat, p.lng, 1.02);
      positionsArray.set([v.x, v.y, v.z], i * 3);
      const intensity = Math.min(1, Math.max(0.2, p.intensity ?? 0.8));
      const color = new THREE.Color().setHSL(0.04, 1, 0.5 + intensity * 0.25); // orange-ish
      colorsArray.set([color.r, color.g, color.b], i * 3);
    });
    return { positions: positionsArray, colors: colorsArray };
  }, [points, size]);

  return (
    <points>
      <bufferGeometry>
        {size > 0 ? (
          <>
            <bufferAttribute attach="attributes-position" args={[positions, 3]} />
            <bufferAttribute attach="attributes-color" args={[colors, 3]} />
          </>
        ) : null}
      </bufferGeometry>
      <pointsMaterial size={0.04} vertexColors />
    </points>
  );
}


