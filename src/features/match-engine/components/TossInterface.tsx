"use client"

import React, { useState, useTransition } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Coins, CheckCircle } from 'lucide-react'
import { saveTossDecision } from '@/app/actions/matches'
import { toast } from 'react-hot-toast'

type TossInterfaceProps = {
  matchId: string
  team1: { id: string, name: string, short_name: string }
  team2: { id: string, name: string, short_name: string }
}

export function TossInterface({ matchId, team1, team2 }: TossInterfaceProps) {
  const [winnerId, setWinnerId] = useState<string | null>(null)
  const [decision, setDecision] = useState<'bat' | 'bowl' | null>(null)
  const [isPending, startTransition] = useTransition()

  const handleSaveToss = () => {
    if (!winnerId || !decision) return
    startTransition(async () => {
      const res = await saveTossDecision(matchId, winnerId, decision)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  return (
    <div className="max-w-3xl mx-auto mt-8">
      <Card className="bg-bg-surface border-bg-elevated overflow-hidden">
        <div className="bg-bg-base px-6 py-4 border-b border-bg-elevated flex items-center gap-3">
          <Coins className="text-brand-primary" size={24} />
          <h2 className="text-xl font-bold text-text-primary">Record Toss</h2>
        </div>
        <CardContent className="p-8">
          
          <div className="space-y-8">
            {/* Step 1: Who won? */}
            <div>
              <h3 className="text-lg font-bold text-text-primary mb-4">1. Who won the toss?</h3>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setWinnerId(team1.id)}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    winnerId === team1.id 
                      ? 'border-brand-primary bg-brand-primary/10' 
                      : 'border-bg-elevated bg-bg-base hover:border-brand-primary/50'
                  }`}
                >
                  <span className="font-bold text-text-primary text-lg">{team1.name}</span>
                  {winnerId === team1.id && <CheckCircle size={20} className="text-brand-primary" />}
                </button>
                <button
                  onClick={() => setWinnerId(team2.id)}
                  className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                    winnerId === team2.id 
                      ? 'border-brand-primary bg-brand-primary/10' 
                      : 'border-bg-elevated bg-bg-base hover:border-brand-primary/50'
                  }`}
                >
                  <span className="font-bold text-text-primary text-lg">{team2.name}</span>
                  {winnerId === team2.id && <CheckCircle size={20} className="text-brand-primary" />}
                </button>
              </div>
            </div>

            {/* Step 2: Decision */}
            {winnerId && (
              <div className="animate-in fade-in slide-in-from-top-4 duration-300">
                <h3 className="text-lg font-bold text-text-primary mb-4">
                  2. What did {winnerId === team1.id ? team1.name : team2.name} choose to do?
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    onClick={() => setDecision('bat')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      decision === 'bat' 
                        ? 'border-brand-primary bg-brand-primary/10 text-white font-bold' 
                        : 'border-bg-elevated bg-bg-base text-text-secondary hover:text-white hover:border-brand-primary/50'
                    }`}
                  >
                    Bat First
                  </button>
                  <button
                    onClick={() => setDecision('bowl')}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      decision === 'bowl' 
                        ? 'border-brand-primary bg-brand-primary/10 text-white font-bold' 
                        : 'border-bg-elevated bg-bg-base text-text-secondary hover:text-white hover:border-brand-primary/50'
                    }`}
                  >
                    Bowl First
                  </button>
                </div>
              </div>
            )}

            {/* Action */}
            <div className="pt-6 border-t border-bg-elevated flex justify-end">
              <Button 
                variant="primary" 
                size="lg" 
                disabled={!winnerId || !decision}
                isLoading={isPending}
                onClick={handleSaveToss}
              >
                Confirm Toss & Proceed to Playing XI
              </Button>
            </div>
          </div>

        </CardContent>
      </Card>
    </div>
  )
}
