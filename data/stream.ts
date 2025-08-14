export type Registration = { lat: number; lon: number };

/**
 * Mock realtime feed of registration points.
 * Returns an unsubscribe function that cancels the timer.
 */
export function subscribeToRegistrations(onInsert: (r: Registration) => void): () => void {
  let cancelled = false;
  let handle: number | undefined;

  const tick = () => {
    if (cancelled) return;
    const r: Registration = {
      lat: (Math.random() * 180) - 90,      // -90..90
      lon: (Math.random() * 360) - 180,     // -180..180
    };
    onInsert(r);
    const nextDelay = 1500 + Math.random() * 1000; // 1500–2500ms
    handle = (setTimeout(tick, nextDelay) as unknown) as number;
  };

  handle = (setTimeout(tick, 1000 + Math.random() * 1000) as unknown) as number;

  return () => {
    cancelled = true;
    if (handle !== undefined) clearTimeout(handle as unknown as number);
  };
}

// TODO Supabase wiring:
// 1) Install @supabase/supabase-js
// 2) const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
// 3) supabase.channel('registrations').on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'registrations' }, (payload) => onInsert({ lat: payload.new.lat, lon: payload.new.lon })).subscribe()
// 4) Return a cleanup that removes the channel subscription.

/** Diverse seed points across the globe. */
export function seedRegistrations(): Registration[] {
  return [
    { lat: 37.7749, lon: -122.4194 }, // San Francisco
    { lat: 34.0522, lon: -118.2437 }, // Los Angeles
    { lat: 40.7128, lon: -74.006 },   // New York
    { lat: 49.2827, lon: -123.1207 }, // Vancouver
    { lat: 19.4326, lon: -99.1332 },  // Mexico City
    { lat: -23.5505, lon: -46.6333 }, // São Paulo
    { lat: -34.6037, lon: -58.3816 }, // Buenos Aires
    { lat: 51.5074, lon: -0.1278 },   // London
    { lat: 48.8566, lon: 2.3522 },    // Paris
    { lat: 52.52, lon: 13.405 },      // Berlin
    { lat: 31.2304, lon: 121.4737 },  // Shanghai
    { lat: 35.6762, lon: 139.6503 },  // Tokyo
    { lat: 1.3521, lon: 103.8198 },   // Singapore
    { lat: 28.6139, lon: 77.209 },    // Delhi
    { lat: 30.0444, lon: 31.2357 },   // Cairo
    { lat: -1.2921, lon: 36.8219 },   // Nairobi
    { lat: -33.8688, lon: 151.2093 }, // Sydney
  ];
}


