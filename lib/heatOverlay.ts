import * as THREE from "three";

/**
 * A geographic point with amplitude for heat overlay.
 * - lat: latitude in degrees (north positive)
 * - lon: longitude in degrees (east positive)
 * - amp: intensity in [0..1]
 */
export type CityPoint = { lat: number; lon: number; amp: number };

/** Options for the heat overlay. */
export type HeatOverlayOpts = {
  /** Sphere base radius. World units must match your globe radius. */
  radius: number;
  /** Gaussian sigma in degrees. Defaults to 5°. */
  sigmaDeg?: number;
  /** Displacement height scale in world units. Defaults to 0.03 * radius. */
  heightScale?: number;
  /** Upper bound for number of points stored in uniforms. Defaults to 256. */
  maxPoints?: number;
  /** Small offset so overlay sits above the globe surface. Defaults to 0.002. */
  offset?: number;
};

/** Convert latitude/longitude (degrees) to a unit vector in Three.js coordinates (Y-up). */
export function latLonToUnitVec(latDeg: number, lonDeg: number): THREE.Vector3 {
  const lat = THREE.MathUtils.degToRad(latDeg);
  const lon = THREE.MathUtils.degToRad(lonDeg);

  const cosLat = Math.cos(lat);
  const x = cosLat * Math.cos(lon);
  const y = Math.sin(lat);
  const z = cosLat * Math.sin(lon);

  const v = new THREE.Vector3(x, y, z);
  v.normalize();
  return v;
}

/** Internal defaults */
const DEFAULTS = {
  sigmaDeg: 5,
  heightScaleMul: 0.03, // multiplied by radius if heightScale not provided
  maxPoints: 256,
  offset: 0.002,
};

/** Shape returned by createHeatOverlay */
export type HeatOverlayHandle = {
  mesh: THREE.Mesh;
  setPoints(points: CityPoint[]): void;
  setParams(p: Partial<HeatOverlayOpts>): void;
};

/**
 * Create a high-resolution spherical overlay mesh that renders a heatmap as raised Gaussian bumps.
 * The mesh can be added as a child of your globe mesh.
 */
export function createHeatOverlay(opts: HeatOverlayOpts): HeatOverlayHandle {
  const maxPoints = opts.maxPoints ?? DEFAULTS.maxPoints;
  const radius = opts.radius;
  const sigmaDeg = opts.sigmaDeg ?? DEFAULTS.sigmaDeg;
  const heightScale =
    opts.heightScale ?? Math.max(1e-6, DEFAULTS.heightScaleMul * radius);
  const offset = opts.offset ?? DEFAULTS.offset;

  // Geometry – dense sphere (segments only impact smoothness, not radius in shader)
  const geometry = new THREE.SphereGeometry(radius + offset, 256, 256);

  // Uniform array initial values
  const centers = new Array(maxPoints).fill(0).map(() => new THREE.Vector3(0, 0, 0));
  const amps = new Float32Array(maxPoints).fill(0);

  // Build GLSL defines and uniforms
  const defines = {
    MAX_POINTS: maxPoints,
  } as const;

  const uniforms: Record<string, THREE.IUniform> = {
    uBaseRadius: { value: radius + offset },
    uSigma: { value: THREE.MathUtils.degToRad(sigmaDeg) },
    uHeightScale: { value: heightScale },
    uCount: { value: 0 },
    uCenters: { value: centers },
    uAmps: { value: amps },
  };

  // Vertex shader: displace by sum of Gaussian bumps
  const vertexShader = /* glsl */ `
    precision highp float;

    uniform float uBaseRadius;
    uniform float uSigma; // radians
    uniform float uHeightScale;
    uniform int uCount;
    uniform vec3 uCenters[MAX_POINTS];
    uniform float uAmps[MAX_POINTS];

    varying float vIntensity;

    void main() {
      // Direction from sphere center for this vertex
      vec3 n = normalize(position);
      float sumW = 0.0;

      // Accumulate Gaussian contributions
      for (int i = 0; i < MAX_POINTS; ++i) {
        if (i >= uCount) break;
        vec3 c = uCenters[i];
        float dotNC = clamp(dot(n, c), -1.0, 1.0);
        float theta = acos(dotNC); // angular distance in radians
        float amp = uAmps[i];
        float w = amp * exp(-0.5 * (theta * theta) / (uSigma * uSigma));
        sumW += w;
      }

      float displacedR = uBaseRadius + sumW * uHeightScale;
      vec3 displaced = n * displacedR;

      vIntensity = sumW;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
    }
  `;

  // Fragment shader: color ramp blue->cyan->yellow->red, alpha from intensity
  const fragmentShader = /* glsl */ `
    precision highp float;
    varying float vIntensity;

    vec3 ramp(float t) {
      // Piecewise linear gradient between 4 colors
      t = clamp(t, 0.0, 1.0);
      vec3 c0 = vec3(0.0, 0.2, 1.0); // blue
      vec3 c1 = vec3(0.0, 1.0, 1.0); // cyan
      vec3 c2 = vec3(1.0, 1.0, 0.0); // yellow
      vec3 c3 = vec3(1.0, 0.0, 0.0); // red

      float seg = t * 3.0;
      if (seg < 1.0) {
        return mix(c0, c1, seg);
      } else if (seg < 2.0) {
        return mix(c1, c2, seg - 1.0);
      } else {
        return mix(c2, c3, seg - 2.0);
      }
    }

    void main() {
      float alpha = smoothstep(0.02, 0.10, vIntensity);
      if (alpha <= 0.0) discard;
      vec3 color = ramp(min(1.0, vIntensity));
      gl_FragColor = vec4(color, alpha);
    }
  `;

  const material = new THREE.ShaderMaterial({
    uniforms,
    defines,
    vertexShader,
    fragmentShader,
    transparent: true,
    depthWrite: false,
    blending: THREE.NormalBlending,
  });

  const mesh = new THREE.Mesh(geometry, material);

  function setPoints(points: CityPoint[]) {
    const count = Math.min(points.length, maxPoints);
    for (let i = 0; i < count; i += 1) {
      const p = points[i];
      const v = latLonToUnitVec(p.lat, p.lon);
      centers[i].copy(v);
      amps[i] = THREE.MathUtils.clamp(p.amp, 0, 1);
    }
    // Zero-out remaining slots to avoid stale data
    for (let i = count; i < maxPoints; i += 1) {
      centers[i].set(0, 0, 0);
      amps[i] = 0;
    }
    material.uniforms.uCount.value = count;
    material.uniforms.uCenters.value = centers; // keep reference
    material.uniforms.uAmps.value = amps;
    material.needsUpdate = true;
  }

  function setParams(p: Partial<HeatOverlayOpts>) {
    if (p.radius !== undefined || p.offset !== undefined) {
      const baseR = (p.radius ?? radius) + (p.offset ?? offset);
      material.uniforms.uBaseRadius.value = baseR;
    }
    if (p.sigmaDeg !== undefined) {
      material.uniforms.uSigma.value = THREE.MathUtils.degToRad(p.sigmaDeg);
    }
    if (p.heightScale !== undefined) {
      material.uniforms.uHeightScale.value = p.heightScale;
    }
  }

  return { mesh, setPoints, setParams };
}

export default createHeatOverlay;


