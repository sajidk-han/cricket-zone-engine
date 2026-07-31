"use client"

import React, { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import Link from 'next/link'

export default function MatchSetup() {
  const { id } = useParams()
  const router = useRouter()
  
  const [step, setStep] = useState(1) // 1: Toss, 2: Playing XI, 3: Confirm
  const [tossWinner, setTossWinner] = useState<string | null>(null)
  const [tossDecision, setTossDecision] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Dummy rosters
  const eaglesRoster = [
    { id: '1', name: 'Babar Azam (c)' }, { id: '2', name: 'Shaheen Afridi' }, 
    { id: '3', name: 'Mohammad Rizwan (wk)' }, { id: '4', name: 'Shadab Khan' },
    { id: '5', name: 'Fakhar Zaman' }, { id: '6', name: 'Haris Rauf' },
    { id: '7', name: 'Naseem Shah' }, { id: '8', name: 'Imad Wasim' },
    { id: '9', name: 'Iftikhar Ahmed' }, { id: '10', name: 'Mohammad Amir' },
    { id: '11', name: 'Zaman Khan' }, { id: '12', name: 'Abdullah Shafique' }
  ]
  const [eaglesXI, setEaglesXI] = useState<string[]>(eaglesRoster.slice(0, 11).map(p => p.id))

  const handleStartMatch = () => {
    setIsSubmitting(true)
    setTimeout(() => {
      // In real app, update match state to 'live' and navigate to scoring dashboard
      router.push(`/matches/${id}/scoring`)
    }, 1500)
  }

  const togglePlayer = (playerId: string) => {
    setEaglesXI(prev => 
      prev.includes(playerId) 
        ? prev.filter(p => p !== playerId)
        : prev.length < 11 ? [...prev, playerId] : prev
    )
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col items-center justify-center text-center space-y-4">
        <Badge variant="warning" className="text-sm px-4 py-1">Match Initialization</Badge>
        <h1 className="text-4xl font-black text-text-primary tracking-tight">Eagles vs Tigers</h1>
        <p className="text-text-secondary">Match 11 • Summer Championship T20 • Dubai Stadium</p>
      </div>

      {/* Stepper Progress (UI Only) */}
      <div className="flex items-center justify-center gap-4 py-6">
        <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-primary' : 'text-text-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 1 ? 'bg-brand-primary text-white' : 'bg-bg-elevated text-text-muted'}`}>1</div>
          <span className="font-semibold text-sm">Toss</span>
        </div>
        <div className={`w-16 h-1 border-t-2 ${step >= 2 ? 'border-brand-primary' : 'border-bg-elevated'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-primary' : 'text-text-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 2 ? 'bg-brand-primary text-white' : 'bg-bg-elevated text-text-muted'}`}>2</div>
          <span className="font-semibold text-sm">Playing XI Lock</span>
        </div>
        <div className={`w-16 h-1 border-t-2 ${step >= 3 ? 'border-brand-primary' : 'border-bg-elevated'}`}></div>
        <div className={`flex items-center gap-2 ${step >= 3 ? 'text-brand-primary' : 'text-text-muted'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${step >= 3 ? 'bg-brand-primary text-white' : 'bg-bg-elevated text-text-muted'}`}>3</div>
          <span className="font-semibold text-sm">Start Match</span>
        </div>
      </div>

      {/* Step 1: Toss */}
      {step === 1 && (
        <Card className="animate-in fade-in zoom-in-95 duration-300">
          <CardHeader className="text-center pb-2">
            <CardTitle className="text-2xl">Who won the Toss?</CardTitle>
          </CardHeader>
          <CardContent className="space-y-8 p-8">
            <div className="flex justify-center gap-6">
              <button 
                onClick={() => setTossWinner('eagles')}
                className={`w-40 h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${tossWinner === 'eagles' ? 'border-brand-primary bg-brand-primary/10' : 'border-bg-elevated bg-bg-base hover:border-text-muted'}`}
              >
                <span className="text-5xl">🦅</span>
                <span className="font-bold">Eagles</span>
              </button>
              <button 
                onClick={() => setTossWinner('tigers')}
                className={`w-40 h-40 rounded-2xl border-2 flex flex-col items-center justify-center gap-3 transition-all ${tossWinner === 'tigers' ? 'border-brand-primary bg-brand-primary/10' : 'border-bg-elevated bg-bg-base hover:border-text-muted'}`}
              >
                <span className="text-5xl">🐅</span>
                <span className="font-bold">Tigers</span>
              </button>
            </div>

            {tossWinner && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-300 text-center space-y-4 pt-6 border-t border-bg-elevated">
                <h3 className="text-lg font-medium text-text-secondary">What did they decide?</h3>
                <div className="flex justify-center gap-4">
                  <Button 
                    variant={tossDecision === 'bat' ? 'primary' : 'outline'} 
                    onClick={() => setTossDecision('bat')}
                    className="w-32"
                  >
                    🏏 Bat First
                  </Button>
                  <Button 
                    variant={tossDecision === 'bowl' ? 'primary' : 'outline'} 
                    onClick={() => setTossDecision('bowl')}
                    className="w-32"
                  >
                    🔴 Bowl First
                  </Button>
                </div>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <Button 
                variant="primary" 
                disabled={!tossWinner || !tossDecision}
                onClick={() => setStep(2)}
              >
                Continue to Playing XI &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Playing XI */}
      {step === 2 && (
        <Card className="animate-in fade-in slide-in-from-right-8 duration-300">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Lock Playing XI</CardTitle>
              <Badge variant={eaglesXI.length === 11 ? 'success' : 'warning'}>
                Eagles Selected: {eaglesXI.length}/11
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-bg-elevated">
              
              {/* Eagles Selection (Interactive) */}
              <div className="p-6 space-y-4">
                <h3 className="font-bold text-lg flex items-center gap-2"><span className="text-2xl">🦅</span> Eagles Squad</h3>
                <div className="space-y-2">
                  {eaglesRoster.map(player => (
                    <label 
                      key={player.id} 
                      className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors border ${eaglesXI.includes(player.id) ? 'bg-brand-primary/10 border-brand-primary/50' : 'bg-bg-base border-bg-elevated hover:border-text-muted'}`}
                    >
                      <input 
                        type="checkbox" 
                        className="w-4 h-4 rounded text-brand-primary focus:ring-brand-primary bg-bg-elevated border-text-muted"
                        checked={eaglesXI.includes(player.id)}
                        onChange={() => togglePlayer(player.id)}
                        disabled={!eaglesXI.includes(player.id) && eaglesXI.length >= 11}
                      />
                      <span className={`font-medium ${eaglesXI.includes(player.id) ? 'text-white' : 'text-text-secondary'}`}>
                        {player.name}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Tigers Selection (Mock Pre-filled) */}
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                   <h3 className="font-bold text-lg flex items-center gap-2"><span className="text-2xl">🐅</span> Tigers Squad</h3>
                   <Badge variant="success">11/11 Locked</Badge>
                </div>
                <div className="space-y-2 opacity-70">
                  <div className="p-3 bg-bg-base border border-bg-elevated rounded-lg"><span className="text-text-secondary">Virat Kohli (c)</span></div>
                  <div className="p-3 bg-bg-base border border-bg-elevated rounded-lg"><span className="text-text-secondary">Rohit Sharma</span></div>
                  <div className="p-3 bg-bg-base border border-bg-elevated rounded-lg"><span className="text-text-secondary">Jasprit Bumrah</span></div>
                  <div className="p-3 text-center text-sm text-text-muted">...and 8 others pre-selected</div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-bg-elevated flex justify-between">
              <Button variant="outline" onClick={() => setStep(1)}>&larr; Back to Toss</Button>
              <Button 
                variant="primary" 
                disabled={eaglesXI.length !== 11}
                onClick={() => setStep(3)}
              >
                Confirm Match Data &rarr;
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Final Confirmation */}
      {step === 3 && (
        <Card className="animate-in fade-in zoom-in-95 duration-300 border-green-900/50 bg-green-900/10">
          <CardContent className="p-10 text-center space-y-6">
            <div className="w-20 h-20 bg-green-900/40 border border-green-500/50 rounded-full flex items-center justify-center text-4xl mx-auto">
              ✅
            </div>
            <div>
              <h2 className="text-2xl font-black text-white">Ready to Start!</h2>
              <p className="text-green-200 mt-2">
                {tossWinner === 'eagles' ? 'Eagles' : 'Tigers'} won the toss and elected to {tossDecision}.
              </p>
              <p className="text-text-secondary mt-1">Both Playing XIs have been locked permanently.</p>
            </div>
            
            <div className="pt-6">
              <Button 
                variant="primary" 
                size="lg" 
                className="w-full sm:w-auto text-lg px-12"
                onClick={handleStartMatch}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Initializing Engine...' : 'Go to Live Scoring Dashboard 🏏'}
              </Button>
            </div>
            <div className="pt-2">
              <Button variant="ghost" onClick={() => setStep(2)}>Wait, go back</Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
