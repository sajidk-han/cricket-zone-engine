"use client"

import React, { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Badge } from '@/shared/components/ui/Badge'
import { Trophy, PlayCircle } from 'lucide-react'

export default function MatchCenter() {
  const [matches, setMatches] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchMatches()
  }, [])

  const fetchMatches = async () => {
    const { data, error } = await supabase
      .from('matches')
      .select('*, team1:teams!inner!team1_id(name, deleted_at), team2:teams!inner!team2_id(name, deleted_at), tournament:tournament_id(name)')
      .is('team1.deleted_at', null)
      .is('team2.deleted_at', null)
      .order('created_at', { ascending: false })
    
    if (data) setMatches(data)
    setLoading(false)
  }

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-in fade-in duration-300">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-text-primary tracking-tight">Match Center</h1>
          <p className="text-text-secondary mt-1">Live scores, ongoing battles, and match history</p>
        </div>
        <Link href="/tournaments">
          <Button variant="outline">Initialize Match</Button>
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-primary"></div>
        </div>
      ) : matches.length === 0 ? (
        <Card className="border-dashed border-2 border-bg-elevated bg-transparent shadow-none">
          <CardContent className="p-12 text-center flex flex-col items-center justify-center">
            <Trophy size={48} className="text-text-muted mb-4 opacity-50" />
            <h3 className="text-xl font-bold text-text-primary mb-2">No matches initialized yet</h3>
            <p className="text-text-secondary mb-6 max-w-sm mx-auto">
              Go to the Central Hub (Tournaments) and schedule a match to see it here.
            </p>
            <Link href="/tournaments">
              <Button variant="primary">Go to Tournaments</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {matches.map((m) => (
            <Card key={m.id} className="relative overflow-hidden group hover:border-brand-primary/50 transition-colors">
              <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-primary"></div>
              <CardContent className="p-6 flex flex-col h-full">
                <div className="flex justify-between items-start mb-6">
                  <Badge variant="outline" className="text-text-secondary">
                    {m.tournament?.name || 'Tournament Match'}
                  </Badge>
                  <Badge className="bg-brand-accent/20 text-brand-accent border-brand-accent/30 animate-pulse">
                    {m.status || 'Live'}
                  </Badge>
                </div>

                <div className="flex justify-between items-center mb-8 flex-1">
                  <div className="text-lg font-bold text-text-primary w-2/5 text-right truncate">
                    {m.team1?.name}
                  </div>
                  <div className="text-text-muted font-bold text-xs tracking-widest px-2">
                    VS
                  </div>
                  <div className="text-lg font-bold text-text-primary w-2/5 text-left truncate">
                    {m.team2?.name}
                  </div>
                </div>

                <div className="border-t border-bg-elevated pt-4 flex justify-between items-center">
                  <div className="text-text-secondary text-xs">
                    Toss: <span className="text-text-primary font-medium">{m.toss_decision}</span>
                  </div>
                  <Link href={`/matches/${m.id}/overview`}>
                    <Button size="sm" variant="primary" className="gap-2">
                      <PlayCircle size={14} /> Open Scoring
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
