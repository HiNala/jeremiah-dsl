import * as THREE from "three";

export type Registration = { lat: number; lon: number };

export function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(n, max));
}

export function randomLatLon(): Registration {
  return { lat: Math.random() * 180 - 90, lon: Math.random() * 360 - 180 };
}

export const WORLD_SEED: Registration[] = [
  { lat: 37.7749, lon: -122.4194 },
  { lat: 40.7128, lon: -74.006 },
  { lat: 51.5074, lon: -0.1278 },
  { lat: -33.8688, lon: 151.2093 },
  { lat: 35.6895, lon: 139.6917 },
  { lat: -23.5505, lon: -46.6333 },
  { lat: 48.8566, lon: 2.3522 },
  { lat: 55.7558, lon: 37.6173 },
  { lat: 28.6139, lon: 77.209 },
  { lat: -1.2921, lon: 36.8219 },
  { lat: 34.0522, lon: -118.2437 },
  { lat: 19.076, lon: 72.8777 },
  { lat: 52.52, lon: 13.405 },
  { lat: -34.6037, lon: -58.3816 },
  { lat: 1.3521, lon: 103.8198 },
];

/**
 * Convert latitude/longitude in degrees to a THREE.Vector3 on a sphere using
 * equirectangular mapping.
 *
 * Formulas (degrees → radians):
 *  phi = rad(90 - lat)
 *  theta = rad(lon + 180)
 *  x = -r * sin(phi) * cos(theta)
 *  z =  r * sin(phi) * sin(theta)
 *  y =  r * cos(phi)
 */
export function latLonToVector3(lat: number, lon: number, radius: number = 1): THREE.Vector3 {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon + 180);

  const sinPhi = Math.sin(phi);

  const x = -radius * sinPhi * Math.cos(theta);
  const z = radius * sinPhi * Math.sin(theta);
  const y = radius * Math.cos(phi);

  return new THREE.Vector3(x, y, z);
}


