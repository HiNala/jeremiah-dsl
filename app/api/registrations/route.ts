import { NextRequest, NextResponse } from "next/server";

type Body = {
  name?: string;
  email?: string;
  lat: number;
  lon: number;
  city?: string;
  country?: string;
};

export async function POST(req: NextRequest) {
  let body: Body | null = null;
  try {
    body = (await req.json()) as Body;
  } catch {
    return NextResponse.json({ ok: false, error: "Invalid JSON" }, { status: 400 });
  }

  if (!body || typeof body.lat !== "number" || typeof body.lon !== "number" || Number.isNaN(body.lat) || Number.isNaN(body.lon)) {
    return NextResponse.json({ ok: false, error: "lat and lon must be numbers" }, { status: 400 });
  }

  // Placeholder for future persistence (e.g., Supabase)
  // No database writes for now

  return NextResponse.json({ ok: true });
}


