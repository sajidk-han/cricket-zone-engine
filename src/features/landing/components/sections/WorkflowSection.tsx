"use client"
import React from 'react'
import { motion } from 'framer-motion'
import { Building2, Trophy, Users, Activity, Radio, BarChart3, ArrowRight } from 'lucide-react'

export function WorkflowSection() {
  const steps = [
    { id: 1, title: "Create Organization", icon: <Building2 />, desc: "Set up your district, club, or academy." },
    { id: 2, title: "Start Tournament", icon: <Trophy />, desc: "Configure points table and brackets." },
    { id: 3, title: "Register Teams", icon: <Users />, desc: "Add players and verify squads." },
    { id: 4, title: "Score Matches", icon: <Activity />, desc: "Ball-by-ball live scoring interface." },
    { id: 5, title: "Fans Watch Live", icon: <Radio />, desc: "Instant updates on the Fan Zone." },
    { id: 6, title: "Generate Reports", icon: <BarChart3 />, desc: "Leaderboards and player stats." }
  ]

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } }
  }

  return (
    <section className="py-24 lg:py-32 relative bg-[#09090b]">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        
        <div className="text-center mb-20 max-w-3xl mx-auto">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-bold uppercase tracking-wider mb-6"
          >
            SaaS Workflow
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6"
          >
            From Setup to Live Broadcast in Minutes.
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-lg text-[#a3aed1]"
          >
            A seamless, linear workflow designed specifically for cricket operations.
          </motion.p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 relative"
        >
          {/* Connector Line (Desktop only) */}
          <div className="hidden lg:block absolute top-12 left-10 right-10 h-0.5 bg-[#1b2559] z-0">
             <motion.div 
               initial={{ width: 0 }}
               whileInView={{ width: "100%" }}
               viewport={{ once: true }}
               transition={{ duration: 1.5, ease: "easeInOut" }}
               className="h-full bg-brand-primary shadow-[0_0_10px_rgba(37,99,235,0.5)]"
             ></motion.div>
          </div>

          {steps.map((step, index) => (
            <motion.div key={step.id} variants={itemVariants} className="relative z-10 flex flex-col items-center text-center group">
              <div className="w-24 h-24 rounded-2xl bg-[#111c44] border border-[#1b2559] flex items-center justify-center text-[#8f9bba] mb-6 group-hover:bg-brand-primary group-hover:text-white group-hover:border-brand-primary group-hover:scale-110 transition-all duration-300 shadow-xl relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-white/0 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                {React.cloneElement(step.icon as React.ReactElement, { size: 32 })}
                
                {/* Step Number Badge */}
                <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-[#09090b] border-2 border-[#1b2559] flex items-center justify-center text-xs font-black text-white group-hover:border-brand-primary transition-colors">
                  {step.id}
                </div>
              </div>
              
              <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
              <p className="text-xs text-[#a3aed1] leading-relaxed max-w-[140px]">{step.desc}</p>
              
              {/* Mobile Connector */}
              {index !== steps.length - 1 && (
                <div className="lg:hidden mt-4 -[#1b2559]">
                  <ArrowRight size={20} className="rotate-90 md:rotate-0" />
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

      </div>
    </section>
  )
}
