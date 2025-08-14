import { NextRequest, NextResponse } from "next/server";
import { fakeGeocode } from "@/lib/utils";

export type HeatPoint = { lat: number; lng: number; intensity?: number };

const HEAT_POINTS: HeatPoint[] = [];

export async function GET() {
  return NextResponse.json({ points: HEAT_POINTS });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));
    let point: HeatPoint | null = null;

    if (
      typeof body?.lat === "number" &&
      typeof body?.lng === "number" &&
      Math.abs(body.lat) <= 90 &&
      Math.abs(body.lng) <= 180
    ) {
      point = { lat: body.lat, lng: body.lng, intensity: body.intensity };
    } else if (typeof body?.locationString === "string" && body.locationString.trim().length > 0) {
      const { lat, lng } = fakeGeocode(body.locationString);
      point = { lat, lng };
    }

    if (!point) {
      return NextResponse.json({ error: "Invalid payload" }, { status: 400 });
    }

    HEAT_POINTS.push(point);
    return NextResponse.json({ points: HEAT_POINTS });
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


