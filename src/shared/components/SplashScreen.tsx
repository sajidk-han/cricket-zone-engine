"use client"

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { LogoIcon } from './LogoIcon'

export function SplashScreen() {
  const [show, setShow] = useState(true)

  useEffect(() => {
    // Hide splash screen after 2.5 seconds
    const timer = setTimeout(() => setShow(false), 2500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-gradient-to-br from-[#0b1120] via-[#111c44] to-[#0b1120]"
        >
          {/* Animated Logo Container */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.4 }}
            className="relative"
          >
            {/* Spinning Light Green Gradient Border */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              className="absolute -inset-2 rounded-full border-t-2 border-emerald-400/80 border-r-2 border-emerald-400/20 shadow-[0_0_20px_rgba(52,211,153,0.3)]"
            />
            
            {/* Pulse Effect */}
            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0.8, 0.5] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 bg-brand-primary/20 rounded-full blur-xl"
            />

            {/* The Logo */}
            <div className="relative bg-[#09090b] rounded-full p-4 z-10 flex items-center justify-center w-32 h-32 overflow-hidden shadow-2xl">
              <LogoIcon size={80} />
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="mt-8 flex flex-col items-center"
          >
            <h1 className="text-3xl font-black text-white tracking-widest uppercase">
              Cricket<span className="text-brand-primary">Zone</span>
            </h1>
            <div className="flex gap-1 mt-3">
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0 }} className="w-2 h-2 rounded-full bg-emerald-400" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.2 }} className="w-2 h-2 rounded-full bg-emerald-400" />
              <motion.div animate={{ opacity: [0, 1, 0] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.4 }} className="w-2 h-2 rounded-full bg-emerald-400" />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
