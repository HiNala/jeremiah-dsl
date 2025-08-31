"use client";

import { useEffect, useMemo, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { requestCitySchema, voteSchema } from "@/lib/validations";
import { searchCities } from "@/lib/cities";
import SocialShare from "@/components/SocialShare";

type City = { name: string; votes: number };

export type VoteModalMode = "vote" | "request";

export default function VoteModal({
  open,
  mode,
  city,
  onClose,
  onSuccess,
}: {
  open: boolean;
  mode: VoteModalMode;
  city?: string;
  onClose: () => void;
  onSuccess?: (cities: City[]) => void;
}) {
  const [email, setEmail] = useState("");
  const [cityInput, setCityInput] = useState(city ?? "");
  const [consent, setConsent] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  useEffect(() => {
    if (!open) return;
    setError(null);
    setSuccess(false);
    setSubmitting(false);
    setEmail("");
    setConsent(true);
    setCityInput(city ?? "");
    setShowSuggestions(false);
    setSuggestions([]);
  }, [open, city]);

  // Update suggestions when city input changes
  useEffect(() => {
    if (mode === "request" && cityInput.length > 1) {
      const results = searchCities(cityInput, 8);
      setSuggestions(results);
      setShowSuggestions(results.length > 0);
    } else {
      setShowSuggestions(false);
      setSuggestions([]);
    }
  }, [cityInput, mode]);

  const title = useMemo(() => (mode === "vote" ? "Confirm your vote" : "Request your city"), [mode]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    try {
      setSubmitting(true);
      setError(null);
      let res: Response | null = null;
      if (mode === "vote") {
        const parsed = voteSchema.safeParse({ city: city ?? cityInput, email, consent });
        if (!parsed.success) {
          setError(parsed.error.errors[0]?.message || "Invalid submission");
          setSubmitting(false);
          return;
        }
        res = await fetch("/api/votes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
      } else {
        const parsed = requestCitySchema.safeParse({ city: cityInput, email, consent });
        if (!parsed.success) {
          setError(parsed.error.errors[0]?.message || "Invalid submission");
          setSubmitting(false);
          return;
        }
        res = await fetch("/api/votes", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        });
      }
      if (!res) return;
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data?.error ? JSON.stringify(data.error) : "Something went wrong");
        setSubmitting(false);
        return;
      }
      const data = (await res.json()) as { ok: boolean; cities?: City[] };
      setSuccess(true);
      onSuccess?.(data.cities || []);
      setSubmitting(false);
      setTimeout(() => onClose(), 900);
    } catch (err) {
      setError("Network error. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) onClose(); }}>
      <DialogContent className="bg-black text-white border border-white/10">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold tracking-tight">{title}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === "request" && (
            <div className="space-y-2 relative">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                value={cityInput}
                onChange={(e) => setCityInput(e.target.value)}
                onFocus={() => setShowSuggestions(suggestions.length > 0)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
                placeholder="e.g., New York"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
                required
              />
              {showSuggestions && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 z-50 bg-black/95 border border-white/20 rounded-lg mt-1 max-h-48 overflow-y-auto">
                  {suggestions.map((suggestion, i) => (
                    <button
                      key={suggestion}
                      type="button"
                      onClick={() => {
                        setCityInput(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 text-white hover:bg-white/10 transition-colors first:rounded-t-lg last:rounded-b-lg"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}
          {mode === "vote" && (
            <div className="space-y-2">
              <Label htmlFor="cityStatic">City</Label>
              <Input id="cityStatic" value={city ?? cityInput} readOnly className="bg-white/10 border-white/20 text-white" />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="bg-white/10 border-white/20 text-white placeholder:text-white/40"
              required
            />
          </div>
          <div className="flex items-center gap-2">
            <Checkbox id="consent" checked={consent} onCheckedChange={(v) => setConsent(Boolean(v))} />
            <Label htmlFor="consent" className="text-sm text-white/80">Send me tour updates and news</Label>
          </div>
          {error && <div className="text-red-400 text-sm">{error}</div>}
          {success && (
            <div className="text-center space-y-4">
              <div className="text-6xl animate-bounce">🎉</div>
              <div className="text-green-400 text-lg font-semibold">
                {mode === "vote" ? "Vote submitted!" : "City added to the map!"}
              </div>
              <div className="text-white/70 text-sm">
                {mode === "vote" 
                  ? "Thanks for making your voice heard!" 
                  : "You're the first vote for this city!"
                }
              </div>
              <SocialShare 
                city={city ?? cityInput} 
                votes={0} 
                mode={mode} 
              />
            </div>
          )}
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" onClick={onClose} variant="secondary" className="bg-white/10 text-white border border-white/20">
              Cancel
            </Button>
            <Button type="submit" disabled={submitting} className="bg-brand-flame hover:bg-brand-flame/90 text-white">
              {submitting ? "Submitting…" : mode === "vote" ? "Submit Vote" : "Add City"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}


