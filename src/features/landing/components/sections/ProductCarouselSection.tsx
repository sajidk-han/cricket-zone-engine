"use client"
import React, { useCallback, useEffect, useState } from 'react'
import useEmblaCarousel from 'embla-carousel-react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, LayoutDashboard, Trophy, Users, PlayCircle, BarChart3 } from 'lucide-react'

export function ProductCarouselSection() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: 'center' })
  const [selectedIndex, setSelectedIndex] = useState(0)

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi, setSelectedIndex])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
  }, [emblaApi, onSelect])

  return (
    <section id="interactive-demo" className="py-24 relative overflow-hidden bg-[#050814]">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 text-center mb-16">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-4xl md:text-5xl font-black text-white mb-6"
        >
          See inside the <span className="text-brand-primary">Platform</span>
        </motion.h2>
        <p className="text-xl text-[#a3aed1] max-w-2xl mx-auto">
          Everything you need to run professional cricket tournaments, right out of the box.
        </p>
      </div>

      <div className="relative max-w-6xl mx-auto">
        <div className="overflow-hidden rounded-3xl" ref={emblaRef}>
          <div className="flex touch-pan-y">
            
            {/* Slide 1: Tournament Dashboard */}
            <div className="flex-[0_0_100%] min-w-0 pl-4 md:pl-8 first:pl-0">
              <div className="relative h-[500px] md:h-[650px] w-full rounded-2xl md:rounded-[2rem] border border-[#1b2559] overflow-hidden bg-[#0a0b0e] flex flex-col shadow-2xl">
                {/* Mockup Header */}
                <div className="h-14 border-b border-[#1b2559]/50 flex items-center px-6 justify-between bg-[#111c44]/50">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-black">CZ</div>
                    <div className="font-bold">Tournament Dashboard</div>
                  </div>
                  <div className="px-4 py-1.5 bg-brand-primary text-white text-xs font-bold rounded-md flex items-center justify-center">New Tournament</div>
                </div>
                {/* Mockup Body */}
                <div className="flex flex-1 overflow-hidden">
                  <div className="w-48 border-r border-[#1b2559]/50 p-4 space-y-2 hidden md:block">
                    {[
                      { icon: LayoutDashboard, label: "Overview" },
                      { icon: Trophy, label: "Tournaments", active: true },
                      { icon: Users, label: "Teams" },
                      { icon: BarChart3, label: "Analytics" }
                    ].map((tab, i) => (
                      <div key={i} className={`flex items-center gap-3 p-2 rounded-lg ${tab.active ? 'bg-brand-primary/20 text-brand-primary' : 'text-[#a3aed1]'}`}>
                        <tab.icon size={18} />
                        <span className="text-sm font-medium">{tab.label}</span>
                      </div>
                    ))}
                  </div>
                  <div className="flex-1 p-6 flex flex-col gap-6 relative">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-transparent pointer-events-none"></div>
                    
                    <div className="flex justify-between items-end">
                      <div className="space-y-2 z-10">
                        <h3 className="text-3xl font-black text-white">Summer T20 Cup</h3>
                        <p className="text-[#a3aed1]">Group Stage • 12 Teams</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 z-10">
                      <div className="bg-[#111c44] border border-[#1b2559] rounded-xl p-4">
                        <div className="text-sm text-[#a3aed1] mb-1">Matches Played</div>
                        <div className="text-2xl font-bold">14 / 32</div>
                      </div>
                      <div className="bg-[#111c44] border border-[#1b2559] rounded-xl p-4">
                        <div className="text-sm text-[#a3aed1] mb-1">Total Runs</div>
                        <div className="text-2xl font-bold text-emerald-400">4,289</div>
                      </div>
                      <div className="bg-[#111c44] border border-[#1b2559] rounded-xl p-4">
                        <div className="text-sm text-[#a3aed1] mb-1">Total Wickets</div>
                        <div className="text-2xl font-bold text-red-400">184</div>
                      </div>
                    </div>
                    
                    <div className="flex-1 bg-[#111c44] border border-[#1b2559] rounded-xl p-5 z-10">
                      <div className="text-sm font-bold text-white mb-4">Recent Matches</div>
                      <div className="space-y-4">
                        {[
                          { team1: "Eagles", team2: "Lions", result: "Eagles won by 4 wkts" },
                          { team1: "Tigers", team2: "Panthers", result: "Tigers won by 12 runs" },
                          { team1: "Hawks", team2: "Falcons", result: "Falcons won by 8 wkts" },
                          { team1: "Bears", team2: "Wolves", result: "Match Tied" }
                        ].map((match, i) => (
                          <div key={i} className="flex justify-between items-center border-b border-[#1b2559]/50 pb-3 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-brand-primary/20 flex items-center justify-center text-xs font-bold text-brand-primary">{match.team1[0]}</div>
                              <span className="text-sm text-white font-medium">{match.team1} vs {match.team2}</span>
                            </div>
                            <div className="text-xs text-[#a3aed1]">{match.result}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 2: Live Match Center */}
            <div className="flex-[0_0_100%] min-w-0 pl-4 md:pl-8 first:pl-0">
              <div className="relative h-[500px] md:h-[650px] w-full rounded-2xl md:rounded-[2rem] border border-[#1b2559] overflow-hidden bg-[#0a0b0e] flex flex-col shadow-2xl">
                <div className="h-14 border-b border-[#1b2559]/50 flex items-center px-6 justify-between bg-[#111c44]/50">
                  <div className="flex items-center gap-4">
                    <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-black">CZ</div>
                    <div className="font-bold">Live Match Center</div>
                  </div>
                  <div className="px-3 py-1 bg-red-500/20 text-red-500 text-xs font-bold rounded-full animate-pulse flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-red-500"></div> LIVE
                  </div>
                </div>
                
                <div className="flex-1 p-6 md:p-12 relative flex items-center justify-center">
                  <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent pointer-events-none"></div>
                  
                  <div className="w-full max-w-2xl bg-[#111c44] border border-[#1b2559] rounded-2xl p-8 z-10 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-400 to-emerald-600"></div>
                    
                    <div className="text-sm text-[#a3aed1] uppercase tracking-widest font-bold mb-8">Final • T20 World Cup</div>
                    
                    <div className="flex justify-between items-center mb-8">
                      <div className="text-left">
                        <div className="text-2xl font-bold text-white mb-2">PAK</div>
                        <div className="text-5xl font-black text-white">185<span className="text-2xl text-[#a3aed1]">/4</span></div>
                      </div>
                      <div className="text-3xl font-black text-[#8f9bba]">vs</div>
                      <div className="text-right">
                        <div className="text-2xl font-bold text-[#a3aed1] mb-2">ENG</div>
                        <div className="text-5xl font-black text-[#a3aed1]">132<span className="text-2xl text-[#8f9bba]">/6</span></div>
                      </div>
                    </div>
                    
                    <div className="w-full h-2 bg-[#1b2559] rounded-full overflow-hidden mb-4">
                      <div className="w-[70%] h-full bg-emerald-500"></div>
                    </div>
                    <div className="text-sm font-medium text-emerald-400">ENG need 54 runs in 24 balls</div>
                    
                    <div className="mt-8 pt-8 border-t border-[#1b2559] flex justify-center gap-4">
                      {['4', 'W', '1', '6', '0', '2'].map((ball, i) => (
                        <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${ball === 'W' ? 'bg-red-500 text-white' : ball === '6' || ball === '4' ? 'bg-brand-primary text-white' : 'bg-[#1b2559] text-[#a3aed1]'}`}>
                          {ball}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Slide 3: Player Analytics */}
            <div className="flex-[0_0_100%] min-w-0 pl-4 md:pl-8 first:pl-0">
              <div className="relative h-[500px] md:h-[650px] w-full rounded-2xl md:rounded-[2rem] border border-[#1b2559] overflow-hidden bg-[#0a0b0e] flex flex-col shadow-2xl">
                <div className="h-14 border-b border-[#1b2559]/50 flex items-center px-6 gap-4 bg-[#111c44]/50">
                  <div className="w-8 h-8 bg-brand-primary rounded-lg flex items-center justify-center font-black">CZ</div>
                  <div className="font-bold">Player Profiles</div>
                </div>
                
                <div className="flex-1 p-8 relative">
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-transparent pointer-events-none"></div>
                  
                  <div className="flex gap-8 h-full z-10 relative">
                    <div className="w-1/3 flex flex-col gap-4">
                      <div className="bg-[#111c44] border border-[#1b2559] p-6 rounded-2xl text-center">
                        <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-brand-primary rounded-full mx-auto mb-4 border-4 -[#050814]"></div>
                        <h3 className="text-2xl font-bold text-white">Babar Azam</h3>
                        <p className="text-[#a3aed1]">Right Handed Batsman</p>
                      </div>
                      <div className="flex-1 bg-[#111c44] border border-[#1b2559] rounded-2xl p-6">
                        <div className="text-sm font-bold text-white mb-4">Career Summary</div>
                        <div className="space-y-4">
                          <div className="flex justify-between">
                            <span className="text-sm text-[#a3aed1]">Matches</span>
                            <span className="text-sm font-bold text-white">104</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[#a3aed1]">Highest Score</span>
                            <span className="text-sm font-bold text-white">122*</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[#a3aed1]">Hundreds</span>
                            <span className="text-sm font-bold text-white">3</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm text-[#a3aed1]">Fifties</span>
                            <span className="text-sm font-bold text-white">33</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 grid grid-cols-2 gap-4">
                       <div className="col-span-2 bg-[#111c44] border border-[#1b2559] rounded-2xl p-6 flex items-end gap-2">
                         {[40, 70, 45, 90, 65, 80, 100].map((h, i) => (
                           <div key={i} className="flex-1 bg-purple-500/20 rounded-t-lg relative" style={{ height: `${h}%` }}>
                             <div className="absolute top-0 w-full h-1 bg-purple-500 rounded-t-lg"></div>
                           </div>
                         ))}
                       </div>
                       <div className="bg-[#111c44] border border-[#1b2559] rounded-2xl p-6 flex flex-col justify-center items-center">
                          <div className="text-sm text-[#a3aed1] mb-2">Batting Average</div>
                          <div className="text-5xl font-black text-white">48.5</div>
                       </div>
                       <div className="bg-[#111c44] border border-[#1b2559] rounded-2xl p-6 flex flex-col justify-center items-center">
                          <div className="text-sm text-[#a3aed1] mb-2">Strike Rate</div>
                          <div className="text-5xl font-black text-white">128.4</div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Carousel Controls */}
        <div className="flex items-center justify-center gap-4 mt-8">
          <button 
            onClick={scrollPrev}
            className="w-12 h-12 rounded-full border border-[#1b2559] flex items-center justify-center text-[#a3aed1] hover:text-white hover:border-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <ChevronLeft size={24} />
          </button>
          
          <div className="flex gap-2">
            {[0, 1, 2].map((idx) => (
              <button 
                key={idx}
                onClick={() => emblaApi?.scrollTo(idx)}
                className={`h-2 rounded-full transition-all ${idx === selectedIndex ? 'w-8 bg-brand-primary' : 'w-2 bg-[#1b2559] hover:bg-[#1b2559]/80'}`}
              />
            ))}
          </div>

          <button 
            onClick={scrollNext}
            className="w-12 h-12 rounded-full border border-[#1b2559] flex items-center justify-center text-[#a3aed1] hover:text-white hover:border-brand-primary hover:bg-brand-primary/10 transition-colors"
          >
            <ChevronRight size={24} />
          </button>
        </div>
      </div>
    </section>
  )
}
