"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Trophy, ArrowRight, Play, Star, ListOrdered } from 'lucide-react'
import { Button } from '@/shared/components/ui/Button'
import Link from 'next/link'

export function FanZoneSection() {
  return (
    <section id="fanzone" className="py-24 lg:py-32 relative bg-[#050505] overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex flex-col lg:flex-row items-center gap-16 relative z-10">
        
        {/* Mock Fan Zone Mobile UI */}
        <div className="flex-1 w-full relative perspective-[2000px]">
          <motion.div 
            initial={{ opacity: 0, rotateY: -15, x: -50 }}
            whileInView={{ opacity: 1, rotateY: 0, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, type: "spring" }}
            className="w-full max-w-sm mx-auto relative transform-style-3d"
          >
            {/* Phone Frame */}
            <div className="relative rounded-[2.5rem] border-[8px] border-[#18181b] bg-[#09090b] h-[700px] overflow-hidden shadow-2xl ring-1 ring-white/10">
              {/* Notch */}
              <div className="absolute top-0 inset-x-0 h-6 bg-[#18181b] rounded-b-3xl w-40 mx-auto z-20"></div>
              
              {/* Fake App Content */}
              <div className="h-full flex flex-col pt-8 bg-[#09090b]">
                
                {/* Header */}
                <div className="px-5 py-3 flex justify-between items-center bg-brand-primary">
                  <div className="font-black text-white italic tracking-tighter">CricketZone</div>
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <Trophy size={16} className="text-white" />
                  </div>
                </div>

                {/* Live Match Card */}
                <div className="p-4 bg-gradient-to-b from-brand-primary/20 to-transparent">
                  <div className="bg-[#18181b] rounded-xl border border-[#1b2559] p-4 shadow-xl">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-[10px] text-red-500 font-bold uppercase tracking-widest flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse"></span>
                        Live
                      </span>
                      <span className="text-[10px] text-[#8f9bba]">Final • T20 Cup</span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-bold text-white">EAG</span>
                      <span className="font-black text-white text-xl">185/4 <span className="text-xs font-normal text-[#8f9bba]">(18.2)</span></span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-[#8f9bba]">LIO</span>
                      <span className="font-black text-[#8f9bba]">Yet to bat</span>
                    </div>
                    <div className="mt-3 pt-3 border-t border-[#1b2559] text-xs text-brand-primary font-bold">
                      Ali is on strike (45* off 22)
                    </div>
                  </div>
                </div>

                {/* Live Commentary Feed */}
                <div className="flex-1 px-4 py-2 overflow-hidden flex flex-col gap-3 relative">
                  <div className="absolute top-0 inset-x-0 h-4 bg-gradient-to-b from-[#09090b] to-transparent z-10"></div>
                  
                  {/* Scrolling Feed */}
                  <div className="animate-[scrollUp_10s_linear_infinite] flex flex-col gap-4 pt-10">
                    <CommentaryItem ball="18.2" text="FOUR! Short and wide, Ali cuts it powerfully past point." isBoundary />
                    <CommentaryItem ball="18.1" text="Good length outside off, pushed to cover for a quick single." />
                    <div className="bg-brand-secondary/20 border border-brand-secondary/50 rounded-lg p-3 text-xs">
                      <div className="font-bold text-brand-secondary mb-1">Partnership: 50 runs from 28 balls</div>
                      <div className="text-[#8f9bba]">Ali (32), Khan (18)</div>
                    </div>
                    <CommentaryItem ball="17.6" text="Yorker on middle, dug out to long on." />
                    <CommentaryItem ball="17.5" text="SIX! Massive hit over deep midwicket. That's out of the park!" isBoundary />
                  </div>
                </div>

                {/* Bottom Nav */}
                <div className="h-16 bg-[#18181b] border-t border-[#1b2559] flex justify-around items-center px-4 z-20">
                  <div className="w-10 h-10 rounded-full bg-brand-primary/20 text-brand-primary flex items-center justify-center"><Play size={20} /></div>
                  <div className="w-10 h-10 flex items-center justify-center text-[#8f9bba]"><ListOrdered size={20} /></div>
                  <div className="w-10 h-10 flex items-center justify-center text-[#8f9bba]"><Star size={20} /></div>
                </div>

              </div>
            </div>

            {/* Floating Elements (Caps / POM) */}
            <motion.div 
              animate={{ y: [0, -10, 0] }} 
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -right-8 top-32 bg-[#18181b] border border-[#1b2559] rounded-xl p-3 shadow-2xl flex items-center gap-3 w-48"
            >
              <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white">
                <Trophy size={14} />
              </div>
              <div>
                <div className="text-[10px] text-[#8f9bba] uppercase font-bold tracking-wider">Orange Cap</div>
                <div className="text-sm font-bold text-white">S. Khan (450)</div>
              </div>
            </motion.div>
            
            <motion.div 
              animate={{ y: [0, 10, 0] }} 
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute -left-12 bottom-40 bg-[#18181b] border border-brand-primary/50 rounded-xl p-3 shadow-2xl flex items-center gap-3 w-48"
            >
              <div className="w-8 h-8 rounded-full bg-brand-primary flex items-center justify-center text-white">
                <Star size={14} />
              </div>
              <div>
                <div className="text-[10px] text-brand-primary uppercase font-bold tracking-wider">Player of Match</div>
                <div className="text-sm font-bold text-white">Ali Hasan</div>
              </div>
            </motion.div>

          </motion.div>
        </div>

        {/* Content */}
        <div className="flex-1 w-full">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 text-emerald-500 text-sm font-bold uppercase tracking-wider mb-6"
          >
            Public Fan Zone
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
          >
            A world-class experience for your fans.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#a3aed1] mb-8 leading-relaxed"
          >
            Don't just run a tournament. Broadcast it. CricketZone provides a dedicated public portal for your fans with live ball-by-ball scoring, dynamic points tables, and automated player leaderboards.
          </motion.p>

          <motion.ul 
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3 }}
            className="space-y-4 mb-10"
          >
            <FeatureItem text="Live ball-by-ball commentary" />
            <FeatureItem text="Automated Orange & Purple Cap tracking" />
            <FeatureItem text="Dynamic points table & NRR calculation" />
            <FeatureItem text="No login required for fans" />
          </motion.ul>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <Link href="/public">
              <Button variant="outline" className="rounded-full px-8 py-6 text-base font-bold group border-[#1b2559] hover:border-emerald-500/50 hover:bg-emerald-500/10 hover:text-emerald-500 transition-all">
                Explore Fan Zone
                <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </motion.div>
        </div>

      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes scrollUp {
          0% { transform: translateY(0); }
          100% { transform: translateY(-50%); }
        }
      `}} />
    </section>
  )
}

function CommentaryItem({ ball, text, isBoundary }: { ball: string, text: string, isBoundary?: boolean }) {
  return (
    <div className="flex gap-3 text-sm">
      <div className={`font-bold tabular-nums min-w-[32px] ${isBoundary ? 'text-brand-primary' : 'text-[#8f9bba]'}`}>{ball}</div>
      <div className={isBoundary ? 'text-white font-bold' : 'text-[#a3aed1]'}>{text}</div>
    </div>
  )
}

function FeatureItem({ text }: { text: string }) {
  return (
    <li className="flex items-center gap-3 text-white">
      <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center shrink-0">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
      </div>
      <span className="font-medium">{text}</span>
    </li>
  )
}
