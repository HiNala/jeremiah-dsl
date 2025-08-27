import * as THREE from "three";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function latLngToVector3(lat: number, lng: number, radius = 1): THREE.Vector3 {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  const y = radius * Math.cos(phi);
  return new THREE.Vector3(x, y, z);
}

export function fakeGeocode(q: string): { lat: number; lng: number } {
  // Deterministic hash to lat/lng
  let hash = 0;
  for (let i = 0; i < q.length; i += 1) {
    hash = (hash * 31 + q.charCodeAt(i)) >>> 0;
  }
  // Map hash to lat [-85, 85] and lng [-180, 180]
  const lat = ((hash % 17000) / 100) - 85;
  const lng = (((hash >> 8) % 36000) / 100) - 180;
  return { lat, lng };
}


