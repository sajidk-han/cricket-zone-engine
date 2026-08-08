"use client"
import React from 'react'

import { WifiOff, Shield, Globe2, Activity, Users, Trophy } from 'lucide-react'
import { motion } from 'framer-motion'

export function FeaturesSection() {
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  }

  return (
    <section id="features" className="py-24 lg:py-32 relative overflow-hidden bg-[#09090b]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[800px] bg-brand-primary/5 blur-[150px] pointer-events-none rounded-full"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider mb-6 border border-brand-primary/20"
          >
            Platform Capabilities
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
          >
            A true OS for Cricket.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#a3aed1]"
          >
            Ditch the spreadsheets and WhatsApp groups. Experience enterprise-grade management for tournaments of any size.
          </motion.p>
        </div>

        {/* Bento Grid */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 auto-rows-[250px]"
        >
          {/* Large Feature - Live Scoring */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 row-span-2 group">
            <div className="h-full rounded-xl shadow-md bg-gradient-to-br from-[#12141a] to-[#0a0b0e] border-[#1b2559]/50 hover:border-brand-primary/50 transition-all overflow-hidden relative">
              <div className="absolute top-0 right-0 p-6 text-brand-primary opacity-50 group-hover:scale-110 group-hover:opacity-100 transition-all duration-500">
                <Activity size={48} strokeWidth={1} />
              </div>
              <div className="p-8 flex flex-col justify-end h-full relative z-10">
                <div className="mb-auto">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/20 flex items-center justify-center text-brand-primary mb-6 shadow-lg shadow-brand-primary/10 border border-brand-primary/20">
                    <Activity size={32} />
                  </div>
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white mb-3">Real-time Live Scoring</h3>
                  <p className="text-[#a3aed1] leading-relaxed text-lg max-w-md">
                    Ball-by-ball updates synced instantly to the cloud. Deliver a broadcast-quality experience to fans anywhere in the world.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium Feature - Tournaments */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-2 row-span-1 group">
            <div className="h-full rounded-xl shadow-md bg-[#12141a] border-[#1b2559]/50 hover:border-brand-primary/30 transition-all overflow-hidden relative">
              <div className="absolute right-0 bottom-0 opacity-10 group-hover:opacity-20 transition-opacity translate-x-1/4 translate-y-1/4">
                <Trophy size={160} />
              </div>
              <div className="p-8 flex flex-col justify-center h-full">
                <h3 className="text-xl font-bold text-white mb-2">Automated Tournaments</h3>
                <p className="text-[#a3aed1]">Dynamic points tables, NRR calculation, and automated knockout brackets.</p>
              </div>
            </div>
          </motion.div>

          {/* Small Feature - Multi-Tenant */}
          <motion.div variants={itemVariants} className="col-span-1 row-span-1 group">
            <div className="h-full rounded-xl shadow-md bg-[#12141a] border-[#1b2559]/50 hover:border-emerald-500/30 transition-all overflow-hidden">
              <div className="p-8 flex flex-col items-start justify-between h-full">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-4 group-hover:scale-110 transition-transform">
                  <Globe2 size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Multi-Tenant</h3>
                  <p className="text-[#a3aed1] text-sm">Manage infinite clubs and leagues globally.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Small Feature - Offline */}
          <motion.div variants={itemVariants} className="col-span-1 row-span-1 group">
            <div className="h-full rounded-xl shadow-md bg-[#12141a] border-[#1b2559]/50 hover:border-yellow-500/30 transition-all overflow-hidden">
              <div className="p-8 flex flex-col items-start justify-between h-full">
                <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center text-yellow-500 mb-4 group-hover:scale-110 transition-transform">
                  <WifiOff size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white mb-1">Offline-Ready</h3>
                  <p className="text-[#a3aed1] text-sm">Score in remote areas. Auto-syncs on connect.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Medium Feature - Player Stats */}
          <motion.div variants={itemVariants} className="md:col-span-2 lg:col-span-2 row-span-1 group">
            <div className="h-full rounded-xl shadow-md bg-[#12141a] border-[#1b2559]/50 hover:border-purple-500/30 transition-all overflow-hidden relative">
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:block">
                <div className="flex gap-2 opacity-50 group-hover:opacity-100 transition-opacity">
                  <div className="w-8 h-24 bg-purple-500/20 rounded-full animate-pulse"></div>
                  <div className="w-8 h-16 bg-brand-primary/20 rounded-full animate-pulse delay-75 mt-auto"></div>
                  <div className="w-8 h-32 bg-emerald-500/20 rounded-full animate-pulse delay-150"></div>
                </div>
              </div>
              <div className="p-8 flex flex-col justify-center h-full">
                <h3 className="text-xl font-bold text-white mb-2">Deep Player Analytics</h3>
                <p className="text-[#a3aed1] max-w-sm">Career averages, wagon wheels, strike rates, and comprehensive form analysis across all tournaments.</p>
              </div>
            </div>
          </motion.div>

          {/* Small Feature - Security */}
          <motion.div variants={itemVariants} className="md:col-span-1 lg:col-span-2 row-span-1 group">
            <div className="h-full bg-[#12141a] border-[#1b2559]/50 hover:border-red-500/30 transition-all overflow-hidden relative">
              <div className="p-8 flex items-center gap-6 h-full">
                <div className="w-16 h-16 shrink-0 rounded-2xl bg-red-500/10 flex items-center justify-center text-red-500 group-hover:scale-110 transition-transform">
                  <Shield size={32} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white mb-2">Enterprise Security (RBAC)</h3>
                  <p className="text-[#a3aed1]">Granular permissions ensuring only authorized scorers can modify match data.</p>
                </div>
              </div>
            </div>
          </motion.div>

        </motion.div>

      </div>
    </section>
  )
}
