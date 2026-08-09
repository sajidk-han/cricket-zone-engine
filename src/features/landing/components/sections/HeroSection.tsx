"use client"
import React, { useRef } from 'react'
import Link from 'next/link'
import { motion, useScroll, useTransform } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'
import { ArrowRight, Play, Activity, LayoutDashboard, Trophy, Users, BarChart3, Settings } from 'lucide-react'

export function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"]
  })
  
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"])
  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0])

  return (
    <section ref={containerRef} className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden min-h-screen flex flex-col justify-center">
      
      {/* Animated Mesh Gradient Background & Particles */}
      <motion.div style={{ y, opacity }} className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-brand-primary/20 blur-[120px] rounded-full animate-[pulse_8s_ease-in-out_infinite] mix-blend-screen"></div>
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-brand-accent/20 blur-[150px] rounded-full animate-[pulse_10s_ease-in-out_infinite_reverse] mix-blend-screen"></div>
        <div className="absolute top-[20%] right-[20%] w-[30%] h-[30%] bg-emerald-500/10 blur-[100px] rounded-full animate-[bounce_12s_ease-in-out_infinite] mix-blend-screen"></div>
        
        {/* Floating Abstract Cricket Ball */}
        <motion.div 
          animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} 
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] right-[15%] w-32 h-32 rounded-full bg-gradient-to-br from-red-500/20 to-transparent blur-3xl"
        />
      </motion.div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10 text-center">
        
        {/* Live Platform Status Badge */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#111c44]/50 backdrop-blur-md border border-[#1b2559] text-[#a3aed1] text-sm font-semibold mb-8 hover:border-brand-primary/50 hover:bg-[#1b2559] transition-colors cursor-pointer group shadow-xl"
        >
          <Activity size={16} className="text-emerald-500 animate-pulse" />
          <span className="text-white">All systems operational</span>
          <div className="w-px h-3 bg-[#1b2559] mx-2"></div>
          <span className="text-brand-primary group-hover:text-white transition-colors">v4.0 Released</span>
        </motion.div>

        {/* Headline */}
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-[5.5rem] font-black text-white tracking-tighter leading-[1.05] mb-8 max-w-5xl mx-auto"
        >
          The Enterprise Platform for <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-accent to-emerald-400 animate-gradient bg-[length:200%_auto]">Modern Cricket Tournaments.</span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-xl md:text-2xl text-[#a3aed1] mb-12 max-w-3xl mx-auto leading-relaxed font-medium"
        >
          Manage matches, score live, engage fans, and scale your cricket tournaments from one powerful, cloud-native platform.
        </motion.p>

        {/* CTAs */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 md:gap-6"
        >
          <Link href="/fanzone" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-full px-8 py-4 text-lg font-bold bg-brand-primary text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/50 hover:-translate-y-1 hover:scale-105 transition-all duration-300 flex items-center justify-center gap-2 group ring-2 ring-transparent hover:ring-brand-primary/50 relative overflow-hidden focus:outline-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-[150%] group-hover:translate-x-[150%] transition-transform duration-1000 ease-in-out"></div>
              <Play size={20} fill="currentColor" />
              Explore Fan Zone
            </button>
          </Link>
          <Link href="/register" className="w-full sm:w-auto">
            <button className="w-full sm:w-auto rounded-full px-8 py-4 text-lg font-bold border border-[#a3aed1]/30 hover:border-brand-accent/50 bg-[#111c44]/50 hover:bg-[#1b2559] text-white backdrop-blur-md hover:-translate-y-1 transition-all duration-300 shadow-xl group flex items-center justify-center focus:outline-none">
              Start a Tournament
              <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
            </button>
          </Link>
        </motion.div>

        {/* Dashboard Preview Mockup */}
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5, type: "spring", bounce: 0.2 }}
          className="mt-20 relative mx-auto max-w-[1000px] w-full hidden md:block"
        >
          <div className="relative rounded-2xl md:rounded-t-3xl overflow-hidden border border-[#1b2559]/50 bg-[#0f1115] shadow-2xl shadow-brand-primary/20 ring-1 ring-white/5">
            {/* Mockup Header */}
            <div className="h-10 bg-[#16181d] border-b border-[#1b2559]/50 flex items-center px-4 gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500/80"></div>
                <div className="w-3 h-3 rounded-full bg-green-500/80"></div>
              </div>
              <div className="mx-auto bg-[#0a0b0e] w-48 h-5 rounded-md border border-white/5 flex items-center justify-center">
                <span className="text-[10px] text-[#8f9bba]">app.cricketzone.com</span>
              </div>
            </div>
            
            {/* Mockup Content */}
            <div className="p-6 md:p-8 flex flex-col md:flex-row gap-6">
              {/* Sidebar */}
              <div className="hidden md:flex flex-col gap-2 w-48 border-r border-[#1b2559]/50 pr-4">
                <div className="flex items-center gap-2 mb-6 px-2">
                  <div className="w-6 h-6 rounded bg-brand-primary flex items-center justify-center text-[10px] font-black text-white">CZ</div>
                  <span className="font-bold text-sm text-white">Dashboard</span>
                </div>
                {[
                  { icon: LayoutDashboard, label: 'Overview', active: true },
                  { icon: Trophy, label: 'Tournaments' },
                  { icon: Users, label: 'Teams' },
                  { icon: BarChart3, label: 'Analytics' },
                  { icon: Settings, label: 'Settings' }
                ].map((item, i) => (
                  <div key={i} className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${item.active ? 'bg-brand-primary/10 text-brand-primary font-medium' : 'text-[#a3aed1] hover:text-white hover:bg-[#1b2559]/50'}`}>
                    <item.icon size={16} />
                    {item.label}
                  </div>
                ))}
              </div>

              {/* Main Content */}
              <div className="flex-1 space-y-6">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="text-xl font-bold text-white">Summer T20 District Cup</h3>
                    <p className="text-xs text-[#a3aed1]">Group Stage • 12 Teams</p>
                  </div>
                  <div className="px-3 py-1.5 bg-brand-primary/20 text-brand-primary text-xs font-bold rounded-lg border border-brand-primary/30">
                    Registration Open
                  </div>
                </div>

                {/* Animated Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: "Live Matches", val: 3, color: "text-red-400" },
                    { label: "Total Players", val: 1450, color: "text-brand-primary" },
                    { label: "Runs Scored", val: 24892, color: "text-emerald-400" },
                    { label: "Sixes", val: 1204, color: "text-yellow-400" }
                  ].map((stat, i) => (
                    <motion.div 
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      className="bg-[#111c44] border border-[#1b2559] rounded-xl p-4"
                    >
                      <p className="text-xs text-[#a3aed1] mb-2">{stat.label}</p>
                      <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 + (i * 0.2) }}
                        className={`text-2xl md:text-3xl font-black ${stat.color}`}
                      >
                        {stat.val.toLocaleString()}
                      </motion.div>
                    </motion.div>
                  ))}
                </div>

                {/* Chart Mockup */}
                <div className="h-48 w-full bg-gradient-to-t from-brand-primary/10 to-transparent rounded-xl border border-[#1b2559] relative overflow-hidden">
                  <motion.div 
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: 1 }}
                    transition={{ duration: 1.5, delay: 0.8 }}
                    className="absolute bottom-0 left-0 h-full w-full origin-left"
                    style={{
                      background: 'linear-gradient(90deg, rgba(59,130,246,0) 0%, rgba(59,130,246,0.2) 100%)',
                      clipPath: 'polygon(0 100%, 0 40%, 20% 60%, 40% 30%, 60% 50%, 80% 20%, 100% 40%, 100% 100%)'
                    }}
                  />
                </div>
              </div>
            </div>
            
            {/* Gradient Overlay for blending bottom */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t -[#050814] to-transparent z-10"></div>
          </div>
        </motion.div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient {
          animation: gradient 8s ease infinite;
        }
      `}} />
    </section>
  )
}
