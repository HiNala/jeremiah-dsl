"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { div as MotionDiv, h2 as MotionH2 } from "framer-motion/client";
import { useShaderBackground } from "@/components/hooks/useShaderBackground";

export default function SignUpStrip() {
  const [email,setEmail]=useState("");
  const [ok,setOk]=useState(false);
  const [loading,setLoading]=useState(false);
  const [success,setSuccess]=useState(false);
  const canSubmit = email && ok && !loading;

  const canvasRef = useShaderBackground();

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
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Shader Background */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full object-cover touch-none"
          style={{ background: 'black' }}
        />
        
        {/* Overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />
        
        <div className="relative z-10 text-center px-6 md:px-8 max-w-4xl mx-auto">
          <MotionDiv
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            {/* Success icon */}
            <div className="flex justify-center mb-8">
              <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm shadow-2xl border border-white/20">
                <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
            </div>
            
            <MotionH2 className="text-5xl md:text-7xl font-bold text-white mb-6 tracking-tight">
              You're in!
            </MotionH2>
            <p className="text-2xl md:text-3xl text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
              Welcome to the community. We'll keep you updated on drops, shows, and new videos.
            </p>
            
            {/* Celebration elements */}
            <div className="flex justify-center gap-4 text-4xl">
              <span className="animate-bounce">🎵</span>
              <span className="animate-bounce delay-100">🔥</span>
              <span className="animate-bounce delay-200">✨</span>
            </div>
          </MotionDiv>
        </div>
      </section>
    );
  }

  return (
    <section className="relative min-h-[100svh] flex items-center overflow-hidden">
      {/* Shader Background */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full object-cover touch-none"
        style={{ background: 'black' }}
      />
      {/* Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/40 via-transparent to-black/60" />

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-8 py-16 flex justify-end">
        <div className="w-full max-w-md">
        <MotionDiv
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-md p-8 md:p-12 shadow-2xl min-h-[28rem] flex flex-col justify-center">
            <div className="text-center mb-6">
              <MotionH2 className="text-4xl md:text-5xl font-bold text-white">Sign Up</MotionH2>
              <p className="text-white/70 mt-2">Be the first to know about drops, shows, and videos.</p>
            </div>

            <form onSubmit={onSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white/80">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your@email.com"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>)=>setEmail(e.target.value)}
                  className="h-12 bg-white/10 border-white/20 text-white placeholder:text-white/50"
                  required
                />
              </div>

              <div className="flex items-start gap-3">
                <Checkbox
                  id="consent"
                  checked={ok}
                  onCheckedChange={(v: boolean)=>setOk(Boolean(v))}
                />
                <Label htmlFor="consent" className="text-white/80">
                  I agree to receive marketing messages and updates. See
                  {' '}<a href="/privacy" className="underline text-white/90">Privacy Policy</a>.
                </Label>
              </div>

              <Button
                type="submit"
                disabled={!canSubmit}
                className="w-full h-12 bg-[#FF5A3D] hover:bg-[#e65036] text-white font-semibold"
              >
                {loading ? 'Signing Up…' : 'Sign Up Now'}
              </Button>
            </form>
          </div>
        </MotionDiv>
        </div>
      </div>
    </section>
  );
}