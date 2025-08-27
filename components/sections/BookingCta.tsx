"use client";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function BookingCta({
  imageSrc = "/images/jeremiah-portrait.jpg",
}: { imageSrc?: string }) {
  const r = useRouter();
  
  return (
    <section className="bg-gradient-to-b from-brand-night to-black py-16">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 lg:grid-cols-12">
        <div className="lg:col-span-6 text-white">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl md:text-5xl font-semibold">Book the Jeremiah Miller Experience</h2>
            <p className="mt-4 text-brand-text/80 md:text-lg">
              From intimate proposals to festival stages—bring the ride & the music to your moment.
            </p>
            
            {/* Service Pills */}
            <ul className="mt-4 flex flex-wrap gap-2 text-brand-text/90">
              {["Proposals & Weddings","Festivals","Private Gatherings","Brand Promos"].map(x=>(
                <li key={x} className="rounded-full border border-white/15 px-3 py-1 text-sm bg-white/5 backdrop-blur-sm">
                  {x}
                </li>
              ))}
            </ul>
            
            {/* Action Buttons */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Button 
                className="bg-brand-flame hover:bg-brand-flame/90 text-white font-semibold"
                onClick={()=>r.push("/book?intent=event")}
              >
                Book Me
              </Button>
              <Button 
                variant="outline" 
                className="border-white/40 text-white hover:bg-white hover:text-black"
                onClick={()=>r.push("/world")}
              >
                Request My City
              </Button>
              <Button 
                variant="ghost" 
                className="text-white hover:bg-white/10"
                onClick={()=>r.push("/book?intent=brand")}
              >
                Brand Promo
              </Button>
              <Button 
                variant="secondary" 
                className="bg-brand-glow/20 text-brand-glow border-brand-glow/30"
                onClick={()=>r.push("/videos#burning-for-you")}
              >
                Burning For You
              </Button>
            </div>
            
            <p className="mt-3 text-sm text-white/70">
              Don't have a budget? <button onClick={()=>r.push("/world")} className="underline underline-offset-4 hover:text-brand-flame transition-colors">Request your city</button>.
            </p>
          </motion.div>
        </div>
        
        <div className="lg:col-span-6">
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            whileHover={{ y: -4 }} 
            className="relative aspect-[4/5] overflow-hidden rounded-2xl ring-1 ring-white/10 shadow-2xl"
          >
            {/* Subtle glow effect */}
            <div className="absolute -inset-4 bg-brand-flame/5 rounded-3xl blur-2xl hover:bg-brand-flame/10 transition-all duration-500" />
            
            <Image 
              src={imageSrc} 
              alt="Jeremiah Miller performing" 
              fill 
              className="object-cover transition-transform duration-300 hover:scale-105" 
              priority 
            />
            
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
