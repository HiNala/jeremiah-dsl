"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { Suspense } from "react";
import * as THREE from "three";

export default function GlobeCanvas({ children }: { children?: React.ReactNode }) {
  return (
    <Canvas dpr={[1, 2]} camera={{ position: [0, 0, 3], fov: 50 }}>
      <color attach="background" args={["#000000"]} />
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 5, 5]} intensity={1} />
      <Suspense fallback={null}>
        <mesh>
          <sphereGeometry args={[1, 64, 64]} />
          <meshStandardMaterial color={new THREE.Color("#0b3d91")} />
        </mesh>
        {children}
      </Suspense>
      <OrbitControls makeDefault />
    </Canvas>
  );
}


