"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EdSignup() {
  const [email, setEmail] = useState("");
  const [ok, setOk] = useState(false);
  const [loading, setLoading] = useState(false);
  const canSubmit = Boolean(email && ok && !loading);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setLoading(true);
    try {
      const params = new URLSearchParams(window.location.search);
      const body = {
        email,
        consent: true,
        utm_source: params.get("utm_source"),
        utm_medium: params.get("utm_medium"),
        utm_campaign: params.get("utm_campaign"),
      };
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("subscribe failed");
      setEmail("");
      setOk(false);
      alert("Thanks! You're on the list.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section aria-labelledby="signup-title" className="relative min-h-[100svh] flex items-center justify-center overflow-hidden bg-black">
      {/* Background image */}
      <div className="absolute inset-0">
        <Image
          src="/images/optimized/DSC_3746-lg.avif"
          alt="Jeremiah street performance"
          fill
          priority
          className="object-cover object-center"
        />
        {/* Sky-like cool tint and mask fade */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#a1c4fd]/30 via-[#c2e9fb]/20 to-[#0B0E12]/35" />
        {/* Subtle grain using repeated dot pattern */}
        <div className="absolute inset-0 pointer-events-none opacity-30 [background-image:radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] [background-size:3px_3px] mix-blend-overlay" />
        {/* Soft top/bottom vignette mask */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/35" />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-6 md:px-8 flex items-center justify-end">
        <div className="backdrop-blur-[2px] w-full max-w-lg md:mr-8">
          <h2 id="signup-title" className="text-5xl md:text-6xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.7)] text-left">Sign Up</h2>
          <p className="mt-4 text-white font-medium text-lg md:text-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] text-left">
            Subscribe to be one of the first to know the latest on Jeremiah
          </p>

          <form onSubmit={onSubmit} className="mt-8 space-y-6">
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-white font-semibold drop-shadow-[0_1px_4px_rgba(0,0,0,0.6)]">Email address</label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                className="h-12 text-base bg-white/85 text-black placeholder:text-black/60 border-2 border-white/80 focus:border-white"
                placeholder="you@example.com"
                required
              />
            </div>

            {/* Consent */}
            <div className="flex items-start gap-3 bg-black/20 border border-white/30 rounded-md p-4 text-left">
              <Checkbox id="consent-ed" checked={ok} onCheckedChange={(v) => setOk(Boolean(v))} />
              <label htmlFor="consent-ed" className="text-white/90 text-sm leading-relaxed cursor-pointer">
                I agree to receive marketing messages and updates. See
                {" "}
                <Link href="/privacy" className="underline">Privacy Policy</Link>
                {" "}
                for details.
              </label>
            </div>

            {/* Submit */}
            <Button
              type="submit"
              disabled={!canSubmit}
              className="w-full h-12 text-lg font-bold text-[#2d2d2d] bg-sky-200 hover:bg-sky-300 disabled:opacity-50"
            >
              {loading ? "Signing Up…" : "Sign Up"}
            </Button>
          </form>
        </div>
      </div>
    </section>
  );
}


