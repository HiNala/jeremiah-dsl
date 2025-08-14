/** Create an offscreen canvas and 2D context for heatmap generation. */
export function createHeatmapCanvas({ width = 1024, height = 512 }: { width?: number; height?: number } = {}) {
  const canvas = typeof document !== "undefined" ? document.createElement("canvas") : ({} as HTMLCanvasElement);
  // In SSR, return a minimal stub; callers should guard usage client-side.
  if (!("getContext" in canvas)) {
    return { canvas, ctx: null as unknown as CanvasRenderingContext2D };
  }
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Failed to acquire 2D context for heatmap canvas");
  ctx.clearRect(0, 0, width, height);
  ctx.globalCompositeOperation = "source-over";
  return { canvas, ctx } as const;
}

export type SplatOptions = {
  width?: number;
  height?: number;
  radius?: number; // in pixels
  intensity?: number; // 0..1
};

/** Add a single radial "splat" in heatmap color space using lighter blending. */
export function addSplat(
  ctx: CanvasRenderingContext2D,
  lat: number,
  lon: number,
  opts: SplatOptions = {}
) {
  const { radius = 24, intensity = 1, width = ctx.canvas.width, height = ctx.canvas.height } = opts;

  // Equirectangular mapping from lat/lon to canvas coordinates
  const x = ((lon + 180) / 360) * width;
  const y = ((90 - lat) / 180) * height;

  const r0 = 0; // center
  const r1 = radius;

  const gradient = ctx.createRadialGradient(x, y, r0, x, y, r1);
  const a = Math.max(0, Math.min(1, intensity));
  gradient.addColorStop(0, `rgba(255,0,0,${0.75 * a})`);
  gradient.addColorStop(0.5, `rgba(255,0,0,${0.35 * a})`);
  gradient.addColorStop(1, `rgba(255,0,0,0)`);

  const prev = ctx.globalCompositeOperation;
  ctx.globalCompositeOperation = "lighter";
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(x, y, r1, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = prev;
}

/** Read the full ImageData from the canvas. */
export function canvasToImageData(ctx: CanvasRenderingContext2D): ImageData {
  return ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);
}


