"use client"
import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LayoutDashboard, Users, Trophy, Activity, Settings } from 'lucide-react'

export function WorkspacePreviewSection() {
  const [activeTab, setActiveTab] = useState(0)

  const tabs = [
    { id: 0, label: "Dashboard", icon: <LayoutDashboard size={16} />, color: "from-blue-500/20 to-brand-primary/20" },
    { id: 1, label: "Tournament Settings", icon: <Settings size={16} />, color: "from-emerald-500/20 to-emerald-700/20" },
    { id: 2, label: "Player Roster", icon: <Users size={16} />, color: "from-purple-500/20 to-brand-secondary/20" },
    { id: 3, label: "Match Analytics", icon: <Activity size={16} />, color: "from-amber-500/20 to-orange-500/20" },
  ]

  return (
    <section className="py-24 lg:py-32 relative bg-[#111c44]/30 border-y border-[#1b2559] overflow-hidden">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row gap-16 items-center">
        
        {/* Content Side */}
        <div className="flex-1 w-full space-y-8 z-10">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider"
          >
            Organization Workspace
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter leading-tight"
          >
            Everything you need, <br className="hidden lg:block"/> in one powerful dashboard.
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#a3aed1] leading-relaxed"
          >
            Manage multiple tournaments, verify player registrations, schedule matches, and assign scorers from a centralized, multi-tenant workspace built for scale.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="flex flex-col gap-2 pt-4"
          >
            {tabs.map((tab, i) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(i)}
                className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-300 text-left ${activeTab === i ? 'bg-[#1b2559] text-white shadow-lg' : 'hover:bg-[#1b2559]/50 text-[#a3aed1] hover:text-white'}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${activeTab === i ? 'bg-brand-primary text-white shadow-[0_0_15px_rgba(37,99,235,0.5)]' : 'bg-[#111c44] text-[#8f9bba]'}`}>
                  {tab.icon}
                </div>
                <span className="font-bold">{tab.label}</span>
              </button>
            ))}
          </motion.div>
        </div>

        {/* Visual Mockup Side */}
        <div className="flex-[1.5] w-full relative z-10">
          
          <AnimatePresence mode="wait">
             <motion.div 
               key={activeTab}
               initial={{ opacity: 0, scale: 0.95, y: 10 }}
               animate={{ opacity: 1, scale: 1, y: 0 }}
               exit={{ opacity: 0, scale: 1.05, y: -10 }}
               transition={{ duration: 0.4 }}
               className="relative"
             >
                {/* Glow Behind Browser */}
                <div className={`absolute inset-0 bg-gradient-to-tr ${tabs[activeTab].color} blur-3xl rounded-[3rem] opacity-50`}></div>
                
                {/* Browser Shell */}
                <div className="relative rounded-2xl md:rounded-[2rem] border border-[#1b2559] bg-[#050505] overflow-hidden shadow-2xl">
                  {/* Fake Browser Window Header */}
                  <div className="h-12 bg-[#111c44] border-b border-[#1b2559] flex items-center px-4 gap-2">
                    <div className="flex gap-2">
                      <div className="w-3 h-3 rounded-full bg-red-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-amber-500/80"></div>
                      <div className="w-3 h-3 rounded-full bg-emerald-500/80"></div>
                    </div>
                    <div className="flex-1 mx-4">
                      <div className="bg-[#1b2559]/50 h-6 w-full max-w-sm mx-auto rounded flex items-center justify-center text-[10px] text-[#8f9bba] font-mono">
                        org.cricketzone.com/{tabs[activeTab].label.toLowerCase().replace(' ', '-')}
                      </div>
                    </div>
                  </div>

                  {/* Dynamic Mock Content based on tab */}
                  <div className="h-[400px] md:h-[500px] p-6 bg-gradient-to-b from-[#09090b] to-[#121215]">
                    
                    {activeTab === 0 && (
                      <div className="space-y-6 h-full flex flex-col">
                        <div className="flex gap-4">
                          <div className="w-1/3 h-24 bg-[#1b2559]/30 rounded-xl"></div>
                          <div className="w-1/3 h-24 bg-[#1b2559]/30 rounded-xl"></div>
                          <div className="w-1/3 h-24 bg-[#1b2559]/30 rounded-xl"></div>
                        </div>
                        <div className="flex-1 flex gap-4">
                          <div className="flex-[2] bg-[#1b2559]/20 rounded-xl border border-[#1b2559]/50"></div>
                          <div className="flex-1 bg-[#1b2559]/20 rounded-xl border border-[#1b2559]/50"></div>
                        </div>
                      </div>
                    )}

                    {activeTab === 1 && (
                      <div className="space-y-4 h-full">
                        <div className="w-1/4 h-8 bg-[#1b2559]/50 rounded mb-8"></div>
                        <div className="w-full h-12 bg-[#1b2559]/20 rounded-lg"></div>
                        <div className="w-full h-12 bg-[#1b2559]/20 rounded-lg"></div>
                        <div className="w-3/4 h-12 bg-[#1b2559]/20 rounded-lg"></div>
                        <div className="mt-8 flex gap-4">
                          <div className="w-32 h-10 bg-brand-primary/50 rounded-lg"></div>
                          <div className="w-32 h-10 bg-[#1b2559]/50 rounded-lg"></div>
                        </div>
                      </div>
                    )}

                    {activeTab === 2 && (
                      <div className="h-full flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <div className="w-1/4 h-8 bg-[#1b2559]/50 rounded"></div>
                          <div className="w-32 h-8 bg-[#1b2559]/50 rounded-full"></div>
                        </div>
                        <div className="flex-1 bg-[#1b2559]/20 rounded-xl border border-[#1b2559]/50 flex flex-col divide-y -[#1b2559]/50">
                          {[1,2,3,4,5].map(i => (
                            <div key={i} className="flex-1 flex items-center px-6 gap-4">
                              <div className="w-8 h-8 rounded-full bg-[#1b2559]"></div>
                              <div className="w-1/4 h-4 bg-[#1b2559] rounded"></div>
                              <div className="flex-1"></div>
                              <div className="w-16 h-6 rounded-full bg-[#1b2559]/50"></div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 3 && (
                      <div className="h-full flex flex-col gap-6">
                        <div className="w-1/3 h-8 bg-[#1b2559]/50 rounded"></div>
                        <div className="flex-1 bg-[#1b2559]/20 rounded-xl border border-[#1b2559]/50 p-6 flex items-end gap-2">
                           {[40, 60, 30, 80, 50, 90, 70, 100].map((h, i) => (
                             <div key={i} className="flex-1 bg-amber-500/20 rounded-t" style={{ height: `${h}%` }}></div>
                           ))}
                        </div>
                      </div>
                    )}
                    
                  </div>
                </div>
             </motion.div>
          </AnimatePresence>

        </div>

      </div>
    </section>
  )
}
