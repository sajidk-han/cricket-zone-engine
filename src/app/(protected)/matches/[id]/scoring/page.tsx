"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/shared/components/ui/Dialog'
import Link from 'next/link'

export default function LiveScoringDashboard() {
  const [isWicketModalOpen, setIsWicketModalOpen] = useState(false)
  const [isUndoHovered, setIsUndoHovered] = useState(false)

  // Dummy State for UI Demonstration
  const overTimeline = [
    { type: 'run', value: '1', color: 'bg-bg-elevated text-white' },
    { type: 'wicket', value: 'W', color: 'bg-red-500 text-white' },
    { type: 'run', value: '4', color: 'bg-brand-primary text-white font-bold' },
    { type: 'dot', value: '0', color: 'bg-bg-elevated text-text-secondary' },
    { type: 'run', value: '6', color: 'bg-green-500 text-white font-bold' },
    { type: 'extra', value: '1wd', color: 'bg-yellow-600 text-white font-bold' }
  ]

  return (
    <div className="max-w-[1400px] mx-auto min-h-[calc(100vh-4rem)] flex flex-col gap-6">
      
      {/* 1. Global Scoreboard (Top Bar) */}
      <Card className="border-b-4 border-b-brand-primary rounded-xl overflow-hidden shrink-0">
        <CardContent className="p-0 flex flex-col md:flex-row divide-y md:divide-y-0 md:divide-x divide-bg-elevated">
          {/* Teams Banner */}
          <div className="flex-1 p-6 flex justify-between items-center bg-bg-surface">
             <div className="flex items-center gap-4">
               <div className="w-14 h-14 rounded-xl bg-bg-base border border-bg-elevated flex items-center justify-center text-3xl">🦅</div>
               <div>
                 <h2 className="text-xl font-bold text-white leading-none">Eagles</h2>
                 <p className="text-sm text-text-secondary mt-1">Batting • 1st Innings</p>
               </div>
             </div>
             
             <div className="text-center px-8">
               <div className="flex items-baseline justify-center gap-1">
                 <span className="text-6xl font-black text-white tracking-tighter">134</span>
                 <span className="text-3xl font-bold text-text-secondary">/4</span>
               </div>
               <Badge variant="success" className="mt-2 text-sm px-3 py-0.5">CRR: 9.45</Badge>
             </div>

             <div className="flex items-center gap-4 text-right flex-row-reverse opacity-70">
               <div className="w-14 h-14 rounded-xl bg-bg-base border border-bg-elevated flex items-center justify-center text-3xl grayscale">🐅</div>
               <div>
                 <h2 className="text-xl font-bold text-white leading-none">Tigers</h2>
                 <p className="text-sm text-text-secondary mt-1">Bowling</p>
               </div>
             </div>
          </div>
          
          {/* Over Stats */}
          <div className="w-full md:w-64 p-6 bg-bg-base flex flex-col justify-center items-center">
            <p className="text-text-secondary font-medium uppercase tracking-wider text-sm mb-1">Overs</p>
            <p className="text-5xl font-black text-brand-primary">14.2</p>
            <p className="text-xs text-text-muted mt-2">Target: N/A</p>
          </div>
        </CardContent>
      </Card>

      {/* Main Scoring Area */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6">
        
        {/* 2. Field View (Left Column) */}
        <div className="flex-1 space-y-6 flex flex-col">
          
          {/* Batters */}
          <Card className="flex-1 border-l-4 border-l-blue-500">
            <CardHeader className="py-4 border-b border-bg-elevated bg-bg-surface">
              <CardTitle className="text-base flex items-center gap-2">🏏 Current Batters</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-bg-base text-xs text-text-secondary uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Batsman</th>
                    <th className="px-6 py-3 font-medium text-right">R</th>
                    <th className="px-6 py-3 font-medium text-right">B</th>
                    <th className="px-6 py-3 font-medium text-right">4s</th>
                    <th className="px-6 py-3 font-medium text-right">6s</th>
                    <th className="px-6 py-3 font-medium text-right">SR</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-bg-elevated">
                  {/* Striker */}
                  <tr className="bg-blue-900/10">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                        <span className="font-bold text-white text-lg">Babar Azam *</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right font-black text-xl text-brand-primary">45</td>
                    <td className="px-6 py-4 text-right font-medium">32</td>
                    <td className="px-6 py-4 text-right font-medium text-text-secondary">4</td>
                    <td className="px-6 py-4 text-right font-medium text-text-secondary">1</td>
                    <td className="px-6 py-4 text-right font-medium">140.6</td>
                  </tr>
                  {/* Non-Striker */}
                  <tr>
                    <td className="px-6 py-4">
                      <span className="font-medium text-text-secondary pl-4">Shadab Khan</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-lg text-white">12</td>
                    <td className="px-6 py-4 text-right font-medium text-text-secondary">9</td>
                    <td className="px-6 py-4 text-right font-medium text-text-muted">1</td>
                    <td className="px-6 py-4 text-right font-medium text-text-muted">0</td>
                    <td className="px-6 py-4 text-right font-medium text-text-secondary">133.3</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Bowler */}
          <Card className="border-l-4 border-l-red-500">
            <CardHeader className="py-4 border-b border-bg-elevated bg-bg-surface">
              <CardTitle className="text-base flex items-center gap-2">🔴 Current Bowler</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <table className="w-full text-left">
                <thead className="bg-bg-base text-xs text-text-secondary uppercase">
                  <tr>
                    <th className="px-6 py-3 font-medium">Bowler</th>
                    <th className="px-6 py-3 font-medium text-right">O</th>
                    <th className="px-6 py-3 font-medium text-right">M</th>
                    <th className="px-6 py-3 font-medium text-right">R</th>
                    <th className="px-6 py-3 font-medium text-right">W</th>
                    <th className="px-6 py-3 font-medium text-right">Econ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-red-900/10">
                    <td className="px-6 py-4">
                       <span className="font-bold text-white text-lg">Jasprit Bumrah *</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-white">2.2</td>
                    <td className="px-6 py-4 text-right font-medium text-text-secondary">0</td>
                    <td className="px-6 py-4 text-right font-bold text-white">18</td>
                    <td className="px-6 py-4 text-right font-black text-xl text-red-400">1</td>
                    <td className="px-6 py-4 text-right font-medium">7.71</td>
                  </tr>
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* Over Timeline */}
          <Card className="bg-bg-surface">
            <CardContent className="p-6">
              <p className="text-sm font-bold text-text-secondary uppercase tracking-wider mb-4">This Over (Over 15)</p>
              <div className="flex items-center gap-3 overflow-x-auto pb-2">
                {overTimeline.map((ball, idx) => (
                  <div key={idx} className={`w-12 h-12 rounded-full flex items-center justify-center text-lg shrink-0 shadow-sm ${ball.color}`}>
                    {ball.value}
                  </div>
                ))}
                {/* Pending balls */}
                <div className="w-12 h-12 rounded-full border-2 border-dashed border-bg-elevated flex items-center justify-center shrink-0"></div>
              </div>
            </CardContent>
          </Card>

        </div>

        {/* 3. Control Engine (Right Column) */}
        <Card className="w-full lg:w-[450px] shrink-0 bg-bg-surface border-bg-elevated flex flex-col shadow-2xl">
          <CardHeader className="py-4 border-b border-bg-elevated flex flex-row justify-between items-center bg-bg-base">
            <CardTitle className="text-base text-text-primary">Scoring Controls</CardTitle>
            
            {/* UNDO BUTTON */}
            <button 
              className="group flex items-center gap-2 text-xs font-bold uppercase tracking-wider bg-bg-elevated hover:bg-red-900/40 hover:text-red-400 text-text-secondary px-3 py-1.5 rounded-md transition-colors"
              onMouseEnter={() => setIsUndoHovered(true)}
              onMouseLeave={() => setIsUndoHovered(false)}
            >
              <span>{isUndoHovered ? 'Undo Last?' : '↩ Undo'}</span>
            </button>
          </CardHeader>
          
          <CardContent className="p-6 flex-1 flex flex-col gap-6">
            
            {/* Run Keypad */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Runs off Bat</p>
              <div className="grid grid-cols-3 gap-3">
                {[0, 1, 2, 3, 4, 5].map(runs => (
                   <button 
                     key={runs} 
                     className={`
                       h-16 rounded-xl text-2xl font-black shadow-sm transition-transform active:scale-95
                       ${runs === 4 || runs === 6 ? 'bg-brand-primary text-white border-b-4 border-blue-700' : 'bg-bg-elevated text-text-primary border-b-4 border-bg-base hover:bg-bg-base'}
                     `}
                   >
                     {runs}
                   </button>
                ))}
                <button className="h-16 rounded-xl text-2xl font-black bg-brand-primary text-white border-b-4 border-blue-700 shadow-sm transition-transform active:scale-95">6</button>
                <button className="h-16 rounded-xl text-xl font-bold bg-bg-elevated text-text-primary border-b-4 border-bg-base hover:bg-bg-base shadow-sm transition-transform active:scale-95 col-span-2">More Runs (+)</button>
              </div>
            </div>

            <div className="h-px bg-bg-elevated w-full my-2"></div>

            {/* Extras */}
            <div>
              <p className="text-xs font-bold text-text-muted uppercase tracking-wider mb-3">Extras</p>
              <div className="grid grid-cols-2 gap-3">
                <button className="h-14 rounded-xl text-sm font-bold bg-yellow-900/30 text-yellow-400 border border-yellow-900/50 hover:bg-yellow-900/50 transition-colors">Wide (Wd)</button>
                <button className="h-14 rounded-xl text-sm font-bold bg-yellow-900/30 text-yellow-400 border border-yellow-900/50 hover:bg-yellow-900/50 transition-colors">No Ball (Nb)</button>
                <button className="h-14 rounded-xl text-sm font-bold bg-purple-900/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 transition-colors">Byes (B)</button>
                <button className="h-14 rounded-xl text-sm font-bold bg-purple-900/30 text-purple-400 border border-purple-900/50 hover:bg-purple-900/50 transition-colors">Leg Byes (Lb)</button>
              </div>
            </div>

            <div className="mt-auto space-y-3 pt-6">
              {/* Massive Wicket Button */}
              <button 
                onClick={() => setIsWicketModalOpen(true)}
                className="w-full h-20 rounded-xl bg-red-600 hover:bg-red-700 text-white font-black text-3xl shadow-[0_8px_0_rgb(153,27,27)] active:shadow-[0_0px_0_rgb(153,27,27)] active:translate-y-2 transition-all uppercase tracking-widest flex items-center justify-center gap-3"
              >
                <span>OUT!</span> <span>☝️</span>
              </button>

              <div className="grid grid-cols-2 gap-3">
                 <Button variant="outline" className="h-12 border-bg-elevated text-text-secondary font-bold">Swap Strike 🔄</Button>
                 <Button variant="outline" className="h-12 border-bg-elevated text-text-secondary font-bold">Options ⚙️</Button>
              </div>
            </div>
            
          </CardContent>
        </Card>

      </div>

      {/* 4. Wicket Modal */}
      <Dialog isOpen={isWicketModalOpen} onClose={() => setIsWicketModalOpen(false)}>
        <DialogHeader className="bg-red-900/20 border-b border-red-900/50">
          <DialogTitle className="text-red-400 text-2xl flex items-center gap-2">☝️ Fall of Wicket</DialogTitle>
          <p className="text-sm text-text-secondary mt-1">Select the dismissal type and incoming batsman.</p>
        </DialogHeader>
        <DialogContent className="space-y-6">
          <div className="space-y-3">
             <label className="text-sm font-bold text-text-secondary uppercase">Dismissal Type</label>
             <select className="w-full bg-bg-base border border-bg-elevated rounded-lg p-3 text-white font-medium focus:ring-2 focus:ring-red-500 outline-none">
               <option>Caught</option>
               <option>Bowled</option>
               <option>LBW</option>
               <option>Run Out</option>
               <option>Stumped</option>
               <option>Hit Wicket</option>
             </select>
          </div>

          <div className="space-y-3">
             <label className="text-sm font-bold text-text-secondary uppercase">Fielder (if applicable)</label>
             <select className="w-full bg-bg-base border border-bg-elevated rounded-lg p-3 text-white font-medium focus:ring-2 focus:ring-red-500 outline-none">
               <option>None / N.A</option>
               <option>Virat Kohli</option>
               <option>Rohit Sharma</option>
             </select>
          </div>

          <div className="space-y-3 pt-4 border-t border-bg-elevated">
             <label className="text-sm font-bold text-brand-primary uppercase">Next Batsman</label>
             <select className="w-full bg-blue-900/20 border border-blue-900/50 rounded-lg p-3 text-white font-medium focus:ring-2 focus:ring-blue-500 outline-none">
               <option>Select incoming player...</option>
               <option>Fakhar Zaman</option>
               <option>Haris Rauf</option>
               <option>Naseem Shah</option>
             </select>
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsWicketModalOpen(false)}>Cancel</Button>
          <Button variant="primary" className="bg-red-600 hover:bg-red-700 font-bold px-8">Confirm Wicket</Button>
        </DialogFooter>
      </Dialog>
    </div>
  )
}
