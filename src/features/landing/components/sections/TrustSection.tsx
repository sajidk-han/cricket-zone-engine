"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { ShieldCheck, Wifi, Globe, Lock, Code, Smartphone } from 'lucide-react'

export function TrustSection() {
  const badges = [
    { label: "Pakistan Ready", icon: <Globe size={18} />, color: "text-emerald-500" },
    { label: "Enterprise SaaS", icon: <ShieldCheck size={18} />, color: "text-blue-500" },
    { label: "Offline First", icon: <Wifi size={18} />, color: "text-teal-400" },
    { label: "PWA Ready", icon: <Smartphone size={18} />, color: "text-purple-400" },
    { label: "Multi Tenant", icon: <Globe size={18} />, color: "text-pink-500" },
    { label: "RBAC Security", icon: <Lock size={18} />, color: "text-amber-400" },
    { label: "API Ready", icon: <Code size={18} />, color: "text-cyan-400" },
  ]

  return (
    <section className="py-12 border-y border-[#1b2559]/30 bg-[#111c44]/10 backdrop-blur-sm overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col md:flex-row items-center justify-between gap-8">
        <p className="text-xs font-bold text-[#8f9bba] uppercase tracking-[0.2em] whitespace-nowrap">
          Enterprise Features
        </p>
        
        <div className="flex-1 overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[#09090b] to-transparent z-10"></div>
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-[#09090b] to-transparent z-10"></div>
          
          <div className="flex w-max gap-8 animate-[scroll_30s_linear_infinite] hover:[animation-play-state:paused] will-change-transform">
            {/* Double the array for seamless scrolling */}
            {[...badges, ...badges].map((badge, i) => (
              <div 
                key={i} 
                className="flex items-center gap-2 text-[#a3aed1] hover:text-white transition-colors cursor-pointer group"
              >
                <div className={`${badge.color} transition-transform duration-300 group-hover:scale-110 group-hover:drop-shadow-lg`}>{badge.icon}</div>
                <span className="text-sm font-bold tracking-tight">{badge.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scroll {
          0% { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }
      `}} />
    </section>
  )
}
