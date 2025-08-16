import type { CityFan } from "@/data/fans";
import type { CityPoint } from "@/lib/heatOverlay";

/**
 * Convert CityFan[] to normalized CityPoint[] for the heat overlay.
 * amp = pow(fans / maxFans, 0.7)
 */
export default function fansToPoints(fans: CityFan[]): CityPoint[] {
  if (!fans || fans.length === 0) return [];
  const maxFans = fans.reduce((m, f) => Math.max(m, f.fans || 0), 0) || 1;
  const gamma = 0.7;
  return fans.map((f) => ({
    lat: f.lat,
    lon: f.lon,
    amp: Math.pow(Math.max(0, f.fans) / maxFans, gamma),
  }));
}

/** Merge counts for duplicate lat/lon keys (to 4 decimal places) */
export function mergeFans(input: CityFan[]): CityFan[] {
  const map = new Map<string, CityFan>();
  for (const f of input) {
    const key = `${f.lat.toFixed(4)},${f.lon.toFixed(4)}`;
    const prev = map.get(key);
    if (prev) {
      prev.fans += f.fans;
    } else {
      map.set(key, { ...f });
    }
  }
  return Array.from(map.values());
}


