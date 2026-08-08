"use client"
import React, { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

import { LayoutDashboard, Trophy, Users, Activity, PlayCircle, Settings, Bell } from 'lucide-react'

export function DashboardPreview() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [liveScore, setLiveScore] = useState(185)

  useEffect(() => {
    // Simulate network load
    const timer = setTimeout(() => setIsLoaded(true), 1500)
    
    // Simulate live score incrementing
    const scoreTimer = setInterval(() => {
      if (isLoaded) {
        setLiveScore(prev => prev + (Math.random() > 0.7 ? 1 : 0))
      }
    }, 3000)

    return () => {
      clearTimeout(timer)
      clearInterval(scoreTimer)
    }
  }, [isLoaded])

  return (
    <section className="py-12 lg:py-24 overflow-hidden relative">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-2xl md:rounded-[2rem] border border-[#1b2559] bg-[#111c44]/50 backdrop-blur-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:shadow-[0_40px_80px_rgba(0,0,0,0.8)] hover:border-brand-primary/30 transition-colors duration-700"
        >
          {/* Fake Browser Window Header */}
          <div className="h-12 bg-[#111c44]/80 border-b border-[#1b2559] flex items-center px-4 gap-2">
            <div className="flex gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500/80 hover:bg-red-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-amber-500/80 hover:bg-amber-400 cursor-pointer transition-colors"></div>
              <div className="w-3 h-3 rounded-full bg-emerald-500/80 hover:bg-emerald-400 cursor-pointer transition-colors"></div>
            </div>
            <div className="flex-1 mx-4">
              <div className="bg-[#1b2559]/50 h-6 w-full max-w-md mx-auto rounded flex items-center justify-center text-[10px] text-[#8f9bba] font-mono">
                app.cricketzone.com
              </div>
            </div>
          </div>

          {/* Mock App Layout */}
          <div className="flex h-[650px] bg-[#09090b]">
            
            {/* Mock Sidebar */}
            <div className="w-64 border-r border-[#1b2559] bg-[#111c44]/30 p-4 hidden md:flex flex-col gap-2 relative">
              <div className="flex items-center gap-3 px-2 py-4 mb-4 border-b border-[#1b2559]/50">
                 <div className="w-10 h-10 bg-gradient-to-br from-brand-primary to-brand-accent rounded-xl flex items-center justify-center text-white font-black text-sm shadow-lg shadow-brand-primary/20">EA</div>
                 <div>
                   <div className="text-sm font-bold text-white leading-tight">Elite Academy</div>
                   <div className="text-[10px] text-brand-primary font-bold uppercase tracking-wider">Enterprise Plan</div>
                 </div>
              </div>
              <MockNavItem icon={<LayoutDashboard size={18}/>} label="Dashboard" active />
              <MockNavItem icon={<Trophy size={18}/>} label="Tournaments" />
              <MockNavItem icon={<Users size={18}/>} label="Teams & Players" />
              <MockNavItem icon={<PlayCircle size={18}/>} label="Match Center" />
              <MockNavItem icon={<Activity size={18}/>} label="Analytics" />
              
              <div className="mt-auto">
                <MockNavItem icon={<Settings size={18}/>} label="Settings" />
              </div>
            </div>

            {/* Mock Main Content */}
            <div className="flex-1 p-6 md:p-8 overflow-hidden flex flex-col gap-8 relative">
              
              <AnimatePresence mode="wait">
                {!isLoaded ? (
                  <motion.div 
                    key="skeleton"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute inset-0 p-8 flex flex-col gap-8 bg-[#09090b] z-20"
                  >
                    <div className="flex justify-between items-center">
                      <div className="space-y-2">
                        <div className="w-48 h-8 bg-[#1b2559]/50 rounded animate-pulse"></div>
                        <div className="w-64 h-4 bg-[#1b2559]/30 rounded animate-pulse"></div>
                      </div>
                      <div className="w-32 h-10 bg-[#1b2559]/50 rounded-lg animate-pulse"></div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      {[1,2,3,4].map(i => <div key={i} className="h-32 bg-[#1b2559]/30 rounded-xl animate-pulse"></div>)}
                    </div>
                    <div className="flex-1 grid grid-cols-3 gap-6">
                      <div className="col-span-2 bg-[#1b2559]/30 rounded-2xl animate-pulse"></div>
                      <div className="bg-[#1b2559]/30 rounded-2xl animate-pulse"></div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="content"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="flex-1 flex flex-col gap-8"
                  >
                    {/* Header */}
                    <div className="flex justify-between items-center">
                      <div>
                        <h2 className="text-2xl font-bold text-white">Overview</h2>
                        <p className="text-sm text-[#8f9bba]">Monitor your active tournaments and live matches.</p>
                      </div>
                      <div className="flex gap-4">
                        <div className="w-10 h-10 rounded-full border border-[#1b2559] flex items-center justify-center text-[#a3aed1] hover:text-white cursor-pointer relative">
                          <Bell size={18} />
                          <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
                        </div>
                        <div className="px-5 py-2.5 bg-brand-primary hover:bg-brand-primary/90 transition-colors rounded-lg text-sm font-bold text-white shadow-lg shadow-brand-primary/20 cursor-pointer">
                          + New Tournament
                        </div>
                      </div>
                    </div>

                    {/* KPI Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                      <MockKpiCard title="Active Tournaments" value="3" icon={<Trophy size={20} className="text-brand-primary"/>} trend="+1 this month" delay={0.1} />
                      <MockKpiCard title="Live Matches" value="2" icon={<div className="w-2.5 h-2.5 rounded-full bg-red-500 animate-[pulse_1s_infinite]"/>} active borderHighlight delay={0.2} />
                      <MockKpiCard title="Registered Teams" value="24" icon={<Users size={20} className="text-blue-400"/>} trend="+4 this week" delay={0.3} />
                      <MockKpiCard title="Total Players" value="342" icon={<Activity size={20} className="text-emerald-400"/>} trend="Active" delay={0.4} />
                    </div>

                    {/* Main Dashboard Area */}
                    <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
                      
                      {/* Chart Area */}
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5 }}
                        className="lg:col-span-2 rounded-2xl border border-[#1b2559] bg-[#111c44]/50 p-6 flex flex-col gap-4 relative overflow-hidden group"
                      >
                         <h3 className="text-sm font-bold text-white">Activity Overview</h3>
                         {/* Fake Chart Lines */}
                         <div className="flex-1 flex items-end gap-3 px-4 pb-4 border-b border-l border-[#1b2559] relative">
                           <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/5 to-transparent pointer-events-none"></div>
                           {[40, 70, 45, 90, 65, 80, 100, 85, 120, 95].map((height, i) => (
                             <motion.div 
                               key={i} 
                               initial={{ height: 0 }}
                               animate={{ height: `${height}%` }}
                               transition={{ duration: 1, delay: 0.6 + (i * 0.1), ease: "easeOut" }}
                               className="flex-1 bg-brand-primary/20 rounded-t-md hover:bg-brand-primary/40 transition-colors relative" 
                             >
                               <div className="absolute top-0 left-0 w-full h-1.5 bg-brand-primary rounded-t-md"></div>
                             </motion.div>
                           ))}
                         </div>
                      </motion.div>

                      {/* Live Widget */}
                      <motion.div 
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                        className="rounded-2xl border border-brand-primary/30 bg-[#111c44]/50 p-6 flex flex-col gap-4 relative overflow-hidden group"
                      >
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-brand-primary to-brand-accent"></div>
                        
                        <div className="flex justify-between items-center">
                          <h3 className="text-sm font-bold text-white flex items-center gap-2">
                            <PlayCircle size={16} className="text-brand-primary"/> Live Scoring
                          </h3>
                          <div className="text-[10px] uppercase font-bold text-red-500 bg-red-500/10 px-2.5 py-1 rounded-full animate-pulse">Live</div>
                        </div>
                        
                        <div className="flex-1 bg-[#050505] rounded-xl border border-[#1b2559] p-5 flex flex-col justify-center gap-5 relative">
                          <div className="text-[10px] text-center text-[#8f9bba] uppercase tracking-widest font-bold">T20 Cup Final</div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-white text-lg">Eagles</span>
                            <span className="font-black text-2xl text-white tabular-nums animate-[scoreFlash_4s_infinite]">
                              <motion.span key={liveScore} initial={{ opacity: 0.5, scale: 1.2 }} animate={{ opacity: 1, scale: 1 }}>{liveScore}</motion.span>
                              <span className="text-sm text-[#8f9bba] font-normal">/4</span>
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-[#8f9bba] text-lg">Lions</span>
                            <span className="font-black text-2xl text-[#8f9bba] tabular-nums">82<span className="text-sm font-normal">/2</span></span>
                          </div>
                          <div className="w-full bg-[#1b2559] h-1.5 rounded-full mt-2 overflow-hidden">
                            <div className="bg-brand-primary h-full w-[45%] rounded-full"></div>
                          </div>
                          <div className="text-xs text-[#a3aed1] text-center">Lions need 104 runs in 42 balls</div>
                        </div>
                      </motion.div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

            </div>
          </div>
          
          {/* Absolute Gradients for glare effect */}
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-white/5 via-transparent to-transparent pointer-events-none"></div>

        </motion.div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scoreFlash {
          0%, 100% { color: white; }
          50% { color: #3b82f6; text-shadow: 0 0 10px rgba(59, 130, 246, 0.5); }
        }
      `}} />
    </section>
  )
}

function MockNavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium cursor-pointer transition-colors ${active ? 'bg-brand-primary/10 text-brand-primary' : 'text-[#a3aed1] hover:text-white hover:bg-[#1b2559]/50'}`}>
      {icon}
      {label}
    </div>
  )
}

function MockKpiCard({ title, value, icon, trend, active, borderHighlight, delay }: { title: string, value: string, icon: React.ReactNode, trend?: string, active?: boolean, borderHighlight?: boolean, delay: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
    >
      <div className={`rounded-xl shadow-md overflow-hidden h-full bg-[#111c44]/50 transition-colors cursor-pointer hover:bg-[#1b2559]/30 ${borderHighlight ? 'border-brand-primary/50 shadow-lg shadow-brand-primary/10' : 'border-[#1b2559]'}`}>
        <div className="p-5 flex flex-col justify-between h-32">
          <div className="flex justify-between items-start">
            <span className="text-sm text-[#a3aed1] font-medium">{title}</span>
            <div className={`rounded-full p-1.5 ${active ? 'bg-brand-primary/10' : 'bg-[#1b2559]'}`}>{icon}</div>
          </div>
          <div>
            <div className="text-3xl font-black text-white">{value}</div>
            {trend && <div className="text-xs text-emerald-500 font-bold mt-1">{trend}</div>}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
