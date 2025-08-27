"use client";
import { Button } from "@/components/ui/button";
import { div as MotionDiv, li as MotionLi, h2 as MotionH2 } from "framer-motion/client";
import { useShaderBackground } from "@/components/hooks/useShaderBackground";

// Cool blue shader adapted from the provided App.tsx example (blue/cyan clouds)
const BLUE_SHADER = `#version 300 es
precision highp float;
out vec4 O; uniform vec2 resolution; uniform float time; 
#define FC gl_FragCoord.xy
#define T time
#define R resolution
#define MN min(R.x,R.y)
float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);} 
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);float a=rnd(i),b=rnd(i+vec2(1,0)),c=rnd(i+vec2(0,1)),d=rnd(i+1.);return mix(mix(a,b,u.x),mix(c,d,u.x),u.y);} 
float fbm(vec2 p){float t=.0,a=1.;mat2 m=mat2(1.,-.5,.2,1.2);for(int i=0;i<5;i++){t+=a*noise(p);p*=2.*m;a*=.5;}return t;} 
float clouds(vec2 p){float d=1.,t=.0;for(float i=.0;i<3.;i++){float a=d*fbm(i*10.+p.x*.2+.2*(1.+i)*p.y+d+i*i+p);t=mix(t,d,a);d=a;p*=2./(i+1.);}return t;} 
void main(){vec2 uv=(FC-.5*R)/MN, st=uv*vec2(2.,1.);
 float bg=clouds(vec2(st.x+T*.2,-st.y));
 vec3 col=vec3(0.0);
 uv*=1.-.25*(sin(T*.08)*.5+.5);
 for(float i=1.; i<10.; i++){
   uv+=.09*cos(i*vec2(.11+.01*i,.8)+i*i+T*.18+.1*uv.x);
   vec2 p=uv; float d=length(p);
   col+=.0016/d*(cos(sin(i)*vec3(0.1,0.6,1.0))+vec3(0.2,0.6,0.95));
   float b=noise(i+p+bg*1.5);
   col+=.0025*b/length(max(p,vec2(b*p.x*.02,p.y)));
   col=mix(col, vec3(bg*.15,bg*.35,bg*.65), d);
 }
 O=vec4(col,1.);
}`;

export default function WorldTeaser({
  topCities = ["Los Angeles","San Francisco","New York","Mexico City","Austin"],
}: { topCities?: string[] }) {
  // Shader background (blue)
  const canvasRef = useShaderBackground(BLUE_SHADER);
  
  // Deterministic votes to avoid hydration mismatches
  const seededVotesForCity = (name: string, index: number): number => {
    const input = `${name}-${index}`;
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      hash = (hash << 5) - hash + input.charCodeAt(i);
      hash |= 0;
    }
    return Math.abs(hash % 1000) + 500; // 500..1499
  };
  
  const handleRequestCity = () => {
    if (typeof window !== 'undefined') {
      window.location.assign("/world");
    }
  };

  return (
    <section className="relative min-h-[100svh] py-10 md:py-12 overflow-hidden">
      {/* Shader background */}
      <canvas
        ref={canvasRef as any}
        className="absolute inset-0 w-full h-full object-cover touch-none"
        style={{ background: "black" }}
        aria-hidden
      />
      {/* Subtle dark mask for better contrast */}
      <div className="absolute inset-0 bg-black/20" aria-hidden />
      
      <div className="mx-auto max-w-7xl px-6 md:px-8 relative z-10">
        <div className="grid gap-8 lg:grid-cols-12 lg:gap-10 items-center">
          
          {/* Content Side */}
          <div className="lg:col-span-6 space-y-6">
            <MotionDiv
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              {/* Section badge */}
              <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2 mb-8 backdrop-blur-sm">
                <div className="w-2 h-2 bg-brand-flame rounded-full animate-pulse" />
                <span className="text-white/80 text-sm font-medium tracking-wide">GLOBAL TOUR</span>
              </div>

              {/* Premium headline */}
              <MotionH2 className="text-5xl md:text-6xl font-bold text-white mb-3 tracking-tight leading-[1]">
                Where should I go
                <br />
                <span className="text-transparent bg-gradient-to-r from-brand-flame via-brand-glow to-brand-flame bg-clip-text">
                  next?
                </span>
              </MotionH2>
              
              {/* Enhanced subtitle */}
              <p className="text-lg md:text-xl text-white/90 font-light mb-5 leading-relaxed max-w-lg">
                Request your city—get friends to vote. 
                <br />
                <span className="text-brand-glow font-medium">The hottest map wins.</span>
              </p>

              {/* Features list */}
              <div className="space-y-3 mb-4">
                {[
                  { icon: "🗳️", text: "Community voting system" },
                  { icon: "🔥", text: "Real-time heat tracking" },
                  { icon: "🌍", text: "Global leaderboard" }
                ].map((feature, index) => (
                  <MotionDiv
                    key={feature.text}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="flex items-center gap-3 text-white/70"
                  >
                    <span className="text-xl">{feature.icon}</span>
                    <span className="font-medium">{feature.text}</span>
                  </MotionDiv>
                ))}
              </div>
              
              {/* Premium CTA */}
              <MotionDiv
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.6 }}
              >
                <Button 
                  size="default"
                  className="group bg-gradient-to-r from-brand-flame to-brand-flame/80 hover:from-brand-flame/90 hover:to-brand-flame text-white font-bold px-8 py-4 text-lg rounded-full shadow-2xl hover:shadow-brand-flame/25 transition-all duration-300 transform hover:scale-105" 
                  onClick={handleRequestCity}
                >
                  <span className="flex items-center gap-3">
                    Request My City
                    <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                    </svg>
                  </span>
                </Button>
              </MotionDiv>
            </MotionDiv>
          </div>
          
          {/* Premium Leaderboard */}
          <div className="lg:col-span-6">
            <MotionDiv 
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative md:ml-16 lg:ml-24 xl:ml-36"
            >
              {/* Leaderboard container */}
              <div className="relative group">
                {/* Glow effects */}
                <div className="absolute -inset-8 bg-gradient-to-r from-brand-flame/20 to-brand-glow/20 rounded-3xl blur-2xl group-hover:from-brand-flame/30 group-hover:to-brand-glow/30 transition-all duration-700" />
                
                <div className="relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl max-h-[calc(100svh-200px)] overflow-auto">
                  {/* Header */}
                  <div className="p-4 md:p-5 border-b border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-brand-flame rounded-full animate-pulse" />
                        <h3 className="text-lg md:text-xl font-bold text-white">Top Cities</h3>
                      </div>
                      <div className="flex items-center gap-2 bg-green-500/20 rounded-full px-2 py-0.5">
                        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                        <span className="text-green-300 text-sm font-medium">LIVE</span>
                      </div>
                    </div>
                    <p className="text-white/60 text-xs">Voting updates every 24 hours</p>
                  </div>
                  
                  {/* Cities list */}
                  <div className="p-4 md:p-5">
                    <div className="space-y-3">
                      {topCities.map((city, index) => {
                        const percentage = 80 - index * 12;
                        const isTop3 = index < 3;
                        
                        return (
                          <MotionLi 
                            key={city} 
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                            className="group relative"
                          >
                            <div className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 ${
                              isTop3 
                                ? 'bg-gradient-to-r from-brand-flame/10 to-brand-glow/10 border border-brand-flame/20' 
                                : 'bg-white/5 hover:bg-white/10 border border-white/10'
                            }`}>
                              <div className="flex items-center gap-4">
                                {/* Rank with special styling for top 3 */}
                                <div className={`flex items-center justify-center w-8 h-8 rounded-full font-bold text-sm ${
                                  index === 0 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-black' :
                                  index === 1 ? 'bg-gradient-to-br from-gray-300 to-gray-500 text-black' :
                                  index === 2 ? 'bg-gradient-to-br from-amber-600 to-amber-800 text-white' :
                                  'bg-white/10 text-white'
                                }`}>
                                  {index + 1}
                                </div>
                                
                                <div>
                                  <h4 className={`text-base md:text-lg font-semibold transition-colors ${
                                    isTop3 ? 'text-white' : 'text-white/90 group-hover:text-white'
                                  }`}>
                                    {city}
                                  </h4>
                                  <p className="text-white/60 text-xs">
                                    {seededVotesForCity(city, index)} votes
                                  </p>
                                </div>
                              </div>
                              
                              {/* Enhanced progress bar */}
                              <div className="flex items-center gap-3">
                                <div className="w-24 md:w-28 h-2 rounded-full bg-white/10 overflow-hidden">
                                  <MotionDiv 
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${percentage}%` }}
                                    viewport={{ once: true }}
                                    transition={{ 
                                      duration: 1.2, 
                                      delay: 1.2 + index * 0.1, 
                                      ease: "easeOut" 
                                    }}
                                    className={`h-2 rounded-full ${
                                      isTop3 
                                        ? 'bg-gradient-to-r from-brand-flame to-brand-glow' 
                                        : 'bg-gradient-to-r from-white/40 to-white/20'
                                    }`}
                                  />
                                </div>
                                <span className={`text-xs font-medium min-w-[2.5rem] ${
                                  isTop3 ? 'text-brand-glow' : 'text-white/70'
                                }`}>
                                  {percentage}%
                                </span>
                              </div>
                            </div>
                          </MotionLi>
                        );
                      })}
                    </div>
                    
                    {/* Footer */}
                    <div className="mt-8 pt-6 border-t border-white/10 text-center">
                      <p className="text-white/60 text-sm mb-3">
                        🔥 Live heat + full leaderboard on the World page
                      </p>
                      <button 
                        onClick={handleRequestCity}
                        className="text-brand-flame hover:text-brand-glow font-medium text-sm transition-colors duration-200 underline underline-offset-2"
                      >
                        View Global Map →
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </MotionDiv>
          </div>
        </div>
      </div>
    </section>
  );
}