"use client"
import React from 'react'
import Link from 'next/link'
import { LogoIcon } from '@/shared/components/LogoIcon'
import { ArrowLeft, BookOpen } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from '@/shared/components/ui/Button'

export default function DocsComingSoon() {
  return (
    <div className="min-h-screen bg-[#050814] flex flex-col relative overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[600px] bg-brand-primary/5 blur-[120px] pointer-events-none rounded-full"></div>
      
      {/* Header */}
      <header className="absolute top-0 w-full z-50 bg-[#111c44]/80 backdrop-blur-lg border-b border-[#1b2559] py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <LogoIcon size={32} className="transition-transform group-hover:scale-110 duration-300" />
            <span className="text-2xl font-black text-white tracking-tighter">CricketZone</span>
          </Link>
          <Link href="/">
            <Button variant="outline" className="border-[#1b2559] text-[#a3aed1] hover:text-white hover:bg-[#1b2559]">
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center relative z-10 px-6">
        <div className="max-w-2xl w-full text-center">
          <motion.div 
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="w-24 h-24 mx-auto bg-[#111c44] border border-[#1b2559] rounded-2xl flex items-center justify-center text-brand-primary mb-8 shadow-2xl shadow-brand-primary/10"
          >
            <BookOpen size={48} strokeWidth={1.5} />
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-4"
          >
            Documentation <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-emerald-400">Coming Soon</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-[#a3aed1] leading-relaxed mb-10 max-w-lg mx-auto"
          >
            We are currently building comprehensive developer docs, API references, and guides to help you integrate with CricketZone.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Link href="/contact">
              <button className="rounded-full px-8 py-4 text-lg font-bold bg-brand-primary hover:bg-emerald-600 text-white shadow-lg shadow-brand-primary/25 hover:shadow-brand-primary/50 hover:-translate-y-1 transition-all duration-300">
                Get Notified When It's Ready
              </button>
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  )
}
