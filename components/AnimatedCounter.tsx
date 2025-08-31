"use client";

import { useEffect, useState } from "react";

type AnimatedCounterProps = {
  value: number;
  duration?: number;
  className?: string;
};

export default function AnimatedCounter({ value, duration = 800, className = "" }: AnimatedCounterProps) {
  const [displayValue, setDisplayValue] = useState(0);
  const [prevValue, setPrevValue] = useState(0);

  useEffect(() => {
    if (value === prevValue) return;
    
    setPrevValue(displayValue);
    
    const startTime = Date.now();
    const startValue = displayValue;
    const difference = value - startValue;

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Easing function for smooth animation
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.round(startValue + difference * easeOutCubic);
      
      setDisplayValue(currentValue);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }, [value, duration, displayValue, prevValue]);

  return (
    <span className={`${className} ${value > prevValue ? 'animate-pulse' : ''}`}>
      {displayValue.toLocaleString()}
    </span>
  );
}

