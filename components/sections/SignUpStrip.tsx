"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { motion } from "framer-motion";

export default function SignUpStrip() {
  const [email,setEmail]=useState("");
  const [ok,setOk]=useState(false);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const canSubmit = email && ok && !loading;

  async function onSubmit(e: React.FormEvent){
    e.preventDefault();
    if(!canSubmit) return;
    setLoading(true);
    
    try {
      const params = new URLSearchParams(window.location.search);
      const body = { 
        email, 
        consent: true, 
        utm_source: params.get("utm_source"), 
        utm_medium: params.get("utm_medium"), 
        utm_campaign: params.get("utm_campaign") 
      };
      
      const response = await fetch("/api/subscribe", {
        method: "POST", 
        headers: { "Content-Type": "application/json" }, 
        body: JSON.stringify(body)
      });
      
      if (response.ok) {
        setSuccess(true);
        setEmail("");
        setOk(false);
      } else {
        throw new Error('Subscription failed');
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(255,90,61,0.25),transparent_60%),#0B0E12] py-16">
        <div className="mx-auto max-w-4xl px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-semibold text-white">Thanks! You're in.</h2>
            <p className="mt-2 text-brand-text/80">We'll keep you updated on drops, shows, and new videos.</p>
          </motion.div>
        </div>
      </section>
    );
  }

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,rgba(255,90,61,0.25),transparent_60%),#0B0E12] py-16">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-semibold text-white">Sign Up</h2>
          <p className="mt-2 text-brand-text/80">Be the first to know about drops, shows, and new videos.</p>
          
          <form onSubmit={onSubmit} className="mx-auto mt-6 max-w-2xl">
            <div className="flex flex-col gap-3 md:flex-row">
              <Input 
                type="email" 
                placeholder="Email address" 
                value={email} 
                onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)} 
                className="bg-white/5 border-white/15 text-white placeholder:text-white/40 focus:border-brand-flame focus:ring-brand-flame/20"
                required
              />
              <Button 
                type="submit"
                disabled={!canSubmit} 
                className="bg-brand-flame hover:bg-brand-flame/90 text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Sign Up"}
              </Button>
            </div>
            
            <div className="mt-4 flex items-start gap-2 text-left max-w-md mx-auto">
              <Checkbox 
                id="mkt" 
                checked={ok} 
                onCheckedChange={(v: boolean)=>setOk(Boolean(v))}
                className="border-white/30 data-[state=checked]:bg-brand-flame data-[state=checked]:border-brand-flame"
              />
              <Label 
                htmlFor="mkt" 
                className="text-xs text-white/70 leading-relaxed cursor-pointer"
              >
                I agree to receive marketing messages and updates. See{" "}
                <a href="/privacy" className="underline underline-offset-2 hover:text-brand-flame transition-colors">
                  Privacy Policy
                </a>{" "}
                for details.
              </Label>
            </div>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
