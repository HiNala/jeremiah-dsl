# Jeremiah Miller – Next.js 15 Site

Modern, minimal site built with Next.js App Router, TypeScript, Tailwind CSS, React Three Fiber, and Zustand.

## Tech
- Next.js 15 (App Router)
- TypeScript
- Tailwind CSS
- React Three Fiber + drei + three.js
- React Hook Form + Zod
- Zustand

## Getting Started

1. Install dependencies:

```bash
npm install
```

2. Start dev server:

```bash
npm run dev
```

3. Build for production:

```bash
npm run build && npm start
```

## Media
Place assets under `public/media`:
- `/media/hero.mp4` – looping hero video
- `/media/hero-poster.jpg` – poster image
- `/media/textures/earth.jpg` – globe texture

## API
- `GET /api/heatmap` – returns `{ points: HeatPoint[] }`
- `POST /api/heatmap` – add a point `{ lat, lon, intensity }`

## Globe Heat Overlay (dev controls)
- Shader-based bumps overlay lives in `lib/heatOverlay.ts` and is integrated in `components/Globe.tsx`.
- Tweak at runtime via the floating `HeatOverlayControls` panel:
  - sigmaDeg (1–8)
  - heightScale (0.02–0.15)
  - minAlpha (threshold for fragment alpha)
  - blending: Normal | Additive
  - visible toggle and Bars mode (instanced cylinders via `lib/cityBars.ts`).
- Update points with `updateFans(newFans)` which merges by (lat,lon), normalizes `amp = pow(fans / max, 0.7)` and refreshes uniforms.

Performance notes: a few dozen cities render well. If you plan to exceed ~1k cities, switch to a render-to-texture heatmap pipeline (TODO).

## Server Action
`submitContact` validates with Zod, stores submission in-memory, and posts a heatmap update. Replace in-memory storage with a database or email service later.

## TODOs
- Replace fake geocoding with a real provider
- Add email automation (Resend / Postmark)
- Add database (Postgres / Prisma) for persistence
- Add mobile nav
- Add analytics/SEO polish and OpenGraph imagery
