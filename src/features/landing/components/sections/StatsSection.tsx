"use client"
import React, { useEffect, useState } from 'react'

export function StatsSection() {
  return (
    <section className="py-20 border-y border-[#1b2559] bg-[#111c44]/30 backdrop-blur-sm relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:divide-x -[#1b2559]/50 text-center">
          <StatBox target={1200} suffix="+" label="Organizations" />
          <StatBox target={5000} suffix="+" label="Tournaments" />
          <StatBox target={120} suffix="K+" label="Matches Scored" />
          <StatBox target={2.5} suffix="M+" label="Active Players" decimals={1} />
        </div>
      </div>
    </section>
  )
}

function StatBox({ target, suffix, label, decimals = 0 }: { target: number, suffix: string, label: string, decimals?: number }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number;
    const duration = 2000; // 2 seconds

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      const progress = (currentTime - startTime) / duration;

      if (progress < 1) {
        setCount(target * easeOutQuart(progress));
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target]);

  // easing function
  const easeOutQuart = (x: number): number => 1 - Math.pow(1 - x, 4);

  return (
    <div className="flex flex-col gap-3 group cursor-default p-4 hover:bg-[#1b2559]/10 rounded-xl transition-colors">
      <div className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white -[#a3aed1] -[#8f9bba] group-hover:from-brand-primary group-hover:to-brand-accent transition-all duration-500 transform group-hover:scale-110">
        {count.toFixed(decimals)}{suffix}
      </div>
      <div className="text-sm font-bold tracking-widest text-[#8f9bba] uppercase group-hover:text-white transition-colors">
        {label}
      </div>
    </div>
  )
}
