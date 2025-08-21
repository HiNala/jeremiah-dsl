"use client";

import { useEffect, useState } from "react";
import * as THREE from "three";
import type { HeatOverlayOpts } from "@/lib/heatOverlay";

export type HeatOverlayControlsProps = {
  getOverlay: () => { setParams: (p: Partial<HeatOverlayOpts>) => void; mesh: THREE.Mesh } | null;
  getBars?: () => { mesh: THREE.InstancedMesh; setPoints: (any: any) => void } | null;
};

type Blend = "Normal" | "Additive";

export default function HeatOverlayControls({ getOverlay, getBars }: HeatOverlayControlsProps) {
  const [visible, setVisible] = useState(true);
  const [sigmaDeg, setSigmaDeg] = useState(3);
  const [heightScale, setHeightScale] = useState(0.08);
  const [minAlpha, setMinAlpha] = useState(0.02);
  const [blend, setBlend] = useState<Blend>("Normal");
  const [barsMode, setBarsMode] = useState(false);

  useEffect(() => {
    const overlay = getOverlay();
    if (!overlay) return;
    overlay.setParams({ sigmaDeg, heightScale, minAlpha });
    if (overlay.mesh.material) {
      const m = overlay.mesh.material as THREE.ShaderMaterial;
      m.transparent = true;
      m.depthWrite = false;
      m.blending = blend === "Additive" ? 2 /* AdditiveBlending */ : 1 /* NormalBlending */;
      m.needsUpdate = true;
    }
    overlay.mesh.visible = visible && !barsMode;
    const bars = getBars?.();
    if (bars) bars.mesh.visible = visible && barsMode;
  }, [sigmaDeg, heightScale, minAlpha, blend, visible, barsMode, getOverlay, getBars]);

  return (
    <div className="fixed left-4 top-24 z-50 rounded-md bg-black/60 backdrop-blur text-white p-3 w-64 space-y-3">
      <div className="flex items-center justify-between">
        <span className="font-semibold">Heat Overlay</span>
        <label className="flex items-center gap-2 text-sm">
          <input type="checkbox" checked={visible} onChange={(e) => setVisible(e.target.checked)} /> visible
        </label>
      </div>

      <div>
        <label className="text-sm">sigmaDeg: {sigmaDeg.toFixed(1)}</label>
        <input type="range" min={1} max={8} step={0.1} value={sigmaDeg} onChange={(e) => setSigmaDeg(parseFloat(e.target.value))} className="w-full" />
      </div>
      <div>
        <label className="text-sm">heightScale: {heightScale.toFixed(3)}</label>
        <input type="range" min={0.02} max={0.15} step={0.002} value={heightScale} onChange={(e) => setHeightScale(parseFloat(e.target.value))} className="w-full" />
      </div>
      <div>
        <label className="text-sm">minAlpha: {minAlpha.toFixed(3)}</label>
        <input type="range" min={0} max={0.2} step={0.002} value={minAlpha} onChange={(e) => setMinAlpha(parseFloat(e.target.value))} className="w-full" />
      </div>
      <div className="flex items-center gap-2">
        <label className="text-sm">blending</label>
        <select className="flex-1 bg-black/40 rounded px-2 py-1" value={blend} onChange={(e) => setBlend(e.target.value as Blend)}>
          <option>Normal</option>
          <option>Additive</option>
        </select>
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="bars" checked={barsMode} onChange={(e) => setBarsMode(e.target.checked)} />
        <label htmlFor="bars" className="text-sm">Bars mode</label>
      </div>
    </div>
  );
}


