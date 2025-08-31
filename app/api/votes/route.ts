import { NextRequest, NextResponse } from "next/server";
import { requestCitySchema, subscribeSchema, voteSchema } from "@/lib/validations";
import { broadcast } from "./stream/route";
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit";

type City = { name: string; votes: number };
type VoteRecord = { city: string; email: string };

// In-memory store (replace with DB)
const CITIES: City[] = [
  { name: "Los Angeles", votes: 850 },
  { name: "San Francisco", votes: 1480 },
  { name: "New York", votes: 1056 },
  { name: "Mexico City", votes: 832 },
  { name: "Austin", votes: 869 },
];
const VOTES: VoteRecord[] = [];
const SUBSCRIBERS = new Set<string>();

function normalizeCityName(name: string): string {
  return name.trim().replace(/\s+/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());
}

export async function GET() {
  const sorted = [...CITIES].sort((a, b) => b.votes - a.votes);
  return NextResponse.json({ cities: sorted });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = voteSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { city, email, consent } = parsed.data;
    
    // Rate limiting by email
    const rateLimitKey = `vote:${email.toLowerCase()}`;
    const { allowed, remaining, resetTime } = checkRateLimit(rateLimitKey, 10, 60 * 60 * 1000); // 10 votes per hour
    
    if (!allowed) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Please try again later." },
        { 
          status: 429,
          headers: getRateLimitHeaders(remaining, resetTime)
        }
      );
    }
    
    const keyCity = normalizeCityName(city);

    // prevent duplicate vote per email per city
    const voteKey = `${keyCity}__${email.toLowerCase()}`;
    if (VOTES.some((v) => `${normalizeCityName(v.city)}__${v.email.toLowerCase()}` === voteKey)) {
      return NextResponse.json({ ok: true, duplicate: true, cities: [...CITIES].sort((a, b) => b.votes - a.votes) });
    }

    let cityRec = CITIES.find((c) => normalizeCityName(c.name) === keyCity);
    if (!cityRec) {
      cityRec = { name: keyCity, votes: 0 };
      CITIES.push(cityRec);
    }
    cityRec.votes += 1;
    VOTES.push({ city: keyCity, email: email.toLowerCase() });
    if (consent) SUBSCRIBERS.add(email.toLowerCase());
    
    // Broadcast real-time update
    broadcast({
      type: "vote",
      city: keyCity,
      votes: cityRec.votes,
      timestamp: Date.now()
    });
    
    return NextResponse.json(
      { ok: true, cities: [...CITIES].sort((a, b) => b.votes - a.votes) },
      { headers: getRateLimitHeaders(remaining, resetTime) }
    );
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = requestCitySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { city, email, consent } = parsed.data;
    const keyCity = normalizeCityName(city);
    let cityRec = CITIES.find((c) => normalizeCityName(c.name) === keyCity);
    const isNewCity = !cityRec;
    if (!cityRec) {
      cityRec = { name: keyCity, votes: 0 };
      CITIES.push(cityRec);
    }
    // First vote for requester
    if (!VOTES.some((v) => normalizeCityName(v.city) === keyCity && v.email.toLowerCase() === email.toLowerCase())) {
      cityRec.votes += 1;
      VOTES.push({ city: keyCity, email: email.toLowerCase() });
    }
    if (consent) SUBSCRIBERS.add(email.toLowerCase());
    
    // Broadcast real-time update
    broadcast({
      type: isNewCity ? "new_city" : "vote",
      city: keyCity,
      votes: cityRec.votes,
      timestamp: Date.now()
    });
    
    return NextResponse.json({ ok: true, cities: [...CITIES].sort((a, b) => b.votes - a.votes) });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = subscribeSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { email, consent } = parsed.data;
    if (consent) SUBSCRIBERS.add(email.toLowerCase());
    return NextResponse.json({ ok: true });
  } catch (e) {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }
}


