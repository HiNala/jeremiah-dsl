import * as THREE from "three";
import { latLonToUnitVec } from "@/lib/heatOverlay";
import type { CityPoint } from "@/lib/heatOverlay";

/**
 * Build instanced cylinder bars for city heat points. Designed for a few dozen instances.
 * For >1k instances consider merging geometry or render-to-texture alternative. TODO.
 */
export function createCityBars(radius: number, barScale = 0.25) {
  const instanceCount = 1024; // upper bound, resized on setPoints
  const geom = new THREE.CylinderGeometry(0.01, 0.01, 1, 6, 1);
  geom.translate(0, 0.5, 0); // base at origin, height along +Y
  const mat = new THREE.MeshBasicMaterial({ color: 0xffffff });
  const mesh = new THREE.InstancedMesh(geom, mat, instanceCount);
  mesh.count = 0;

  const color = new THREE.Color();
  const dummy = new THREE.Object3D();

  function ramp(t: number) {
    t = THREE.MathUtils.clamp(t, 0, 1);
    const c0 = new THREE.Color(0x0033ff);
    const c1 = new THREE.Color(0x00ffff);
    const c2 = new THREE.Color(0xffff00);
    const c3 = new THREE.Color(0xff0000);
    const seg = t * 3;
    if (seg < 1) return c0.lerp(c1, seg);
    if (seg < 2) return c1.lerp(c2, seg - 1);
    return c2.lerp(c3, seg - 2);
  }

  function setPoints(points: CityPoint[]) {
    const count = Math.min(points.length, instanceCount);
    mesh.count = count;
    for (let i = 0; i < count; i++) {
      const { lat, lon, amp } = points[i];
      const n = latLonToUnitVec(lat, lon);
      const pos = n.clone().multiplyScalar(radius);
      const q = new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 1, 0), n);
      const height = Math.max(0, amp) * barScale;
      dummy.position.copy(pos);
      dummy.quaternion.copy(q);
      dummy.scale.setScalar(height);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, ramp(amp));
    }
    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }

  return { mesh, setPoints } as const;
}

export default createCityBars;


