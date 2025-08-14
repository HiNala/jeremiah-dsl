"use client";

import { useEffect } from "react";
import GlobeCanvas from "@/components/GlobeCanvas";
import HeatmapOverlay from "@/components/HeatmapOverlay";
import { useHeatmapStore } from "@/stores/useHeatmapStore";

export default function GlobeClient() {
  const refreshFromServer = useHeatmapStore((s) => s.refreshFromServer);
  useEffect(() => {
    refreshFromServer();
  }, [refreshFromServer]);
  return (
    <div className="h-[600px] w-full rounded-lg overflow-hidden bg-foreground/5">
      <GlobeCanvas>
        <HeatmapOverlay />
      </GlobeCanvas>
    </div>
  );
}


