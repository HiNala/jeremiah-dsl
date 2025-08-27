import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function WorldTeaser({
  topCities = ["Los Angeles","San Francisco","New York","Mexico City","Austin"],
}: { topCities?: string[] }) {
  
  const handleRequestCity = () => {
    if (typeof window !== 'undefined') {
      window.location.assign("/world");
    }
  };

  return (
    <section className="bg-brand-night py-16">
      <div className="mx-auto max-w-6xl px-4 grid gap-8 md:grid-cols-2 items-center">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl md:text-5xl font-semibold text-white">Where should I go next?</h2>
          <p className="mt-3 text-brand-text/80 md:text-lg">
            Request your city—get friends to vote. The hottest map wins.
          </p>
          <Button 
            className="mt-6 bg-brand-flame hover:bg-brand-flame/90 text-white font-semibold" 
            onClick={handleRequestCity}
          >
            Request My City
          </Button>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="rounded-2xl border border-white/10 p-6 bg-white/5 backdrop-blur-sm"
        >
          <h3 className="text-brand-text/90 font-medium mb-3">Top Cities</h3>
          <ol className="space-y-2">
            {topCities.map((c,i)=>(
              <motion.li 
                key={c} 
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex items-center justify-between text-brand-text/80"
              >
                <span className="font-medium">{i+1}. {c}</span>
                <div className="h-2 w-24 rounded bg-white/10 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    whileInView={{ width: `${80 - i*10}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.5 + i * 0.1 }}
                    className="h-2 rounded bg-gradient-to-r from-brand-flame to-brand-glow"
                  />
                </div>
              </motion.li>
            ))}
          </ol>
          <p className="mt-3 text-xs text-white/60">Live heat + full leaderboard on the World page.</p>
        </motion.div>
      </div>
    </section>
  );
}
