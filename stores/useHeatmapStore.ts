import { create } from "zustand";

export type Point = { lat: number; lng: number; intensity?: number };

interface HeatState {
  points: Point[];
  setPoints: (p: Point[]) => void;
  addPoint: (p: Point) => void;
  refreshFromServer: () => Promise<void>;
}

export const useHeatmapStore = create<HeatState>((set, get) => ({
  points: [],
  setPoints: (p) => set({ points: p }),
  addPoint: (p) => set({ points: [...get().points, p] }),
  refreshFromServer: async () => {
    const res = await fetch("/api/heatmap", { cache: "no-store" });
    const data = (await res.json()) as { points: Point[] };
    set({ points: data.points || [] });
  },
}));


