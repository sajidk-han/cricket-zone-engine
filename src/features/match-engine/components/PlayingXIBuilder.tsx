"use client"

import React, { useState, useTransition, useMemo } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Users, Check, Crown, Shield } from 'lucide-react'
import { savePlayingXI, PlayingXIPlayer } from '@/app/actions/matches'
import { toast } from 'react-hot-toast'

type Player = {
  id: string
  name: string
  role?: string
}

type PlayingXIBuilderProps = {
  matchId: string
  team1: { id: string, name: string, roster: Player[] }
  team2: { id: string, name: string, roster: Player[] }
}

export function PlayingXIBuilder({ matchId, team1, team2 }: PlayingXIBuilderProps) {
  const [isPending, startTransition] = useTransition()
  
  // State for Team 1
  const [team1Selected, setTeam1Selected] = useState<string[]>([])
  const [team1Cap, setTeam1Cap] = useState<string | null>(null)
  const [team1Wk, setTeam1Wk] = useState<string | null>(null)

  // State for Team 2
  const [team2Selected, setTeam2Selected] = useState<string[]>([])
  const [team2Cap, setTeam2Cap] = useState<string | null>(null)
  const [team2Wk, setTeam2Wk] = useState<string | null>(null)

  const togglePlayer = (team: 1 | 2, playerId: string) => {
    if (team === 1) {
      if (team1Selected.includes(playerId)) {
        setTeam1Selected(team1Selected.filter(id => id !== playerId))
        if (team1Cap === playerId) setTeam1Cap(null)
        if (team1Wk === playerId) setTeam1Wk(null)
      } else {
        if (team1Selected.length >= 11) {
          toast.error("Maximum 11 players allowed")
          return
        }
        setTeam1Selected([...team1Selected, playerId])
      }
    } else {
      if (team2Selected.includes(playerId)) {
        setTeam2Selected(team2Selected.filter(id => id !== playerId))
        if (team2Cap === playerId) setTeam2Cap(null)
        if (team2Wk === playerId) setTeam2Wk(null)
      } else {
        if (team2Selected.length >= 11) {
          toast.error("Maximum 11 players allowed")
          return
        }
        setTeam2Selected([...team2Selected, playerId])
      }
    }
  }

  const handleSave = () => {
    if (team1Selected.length !== 11 || team2Selected.length !== 11) {
      toast.error("Both teams must have exactly 11 players selected.")
      return
    }
    if (!team1Cap || !team2Cap) {
      toast.error("Both teams must have a Captain selected.")
      return
    }
    if (!team1Wk || !team2Wk) {
      toast.error("Both teams must have a Wicket Keeper selected.")
      return
    }

    startTransition(async () => {
      const team1Xi: PlayingXIPlayer[] = team1Selected.map((id, index) => ({
        player_id: id,
        batting_position: index + 1,
        is_captain: id === team1Cap,
        is_wicket_keeper: id === team1Wk
      }))

      const team2Xi: PlayingXIPlayer[] = team2Selected.map((id, index) => ({
        player_id: id,
        batting_position: index + 1,
        is_captain: id === team2Cap,
        is_wicket_keeper: id === team2Wk
      }))

      const res = await savePlayingXI(matchId, team1.id, team1Xi, team2.id, team2Xi)
      if (res.success) {
        toast.success(res.message)
      } else {
        toast.error(res.message)
      }
    })
  }

  const TeamColumn = ({ 
    teamNum, team, selected, cap, setCap, wk, setWk 
  }: { 
    teamNum: 1 | 2, team: { name: string, roster: Player[] }, 
    selected: string[], cap: string | null, setCap: (id: string) => void, 
    wk: string | null, setWk: (id: string) => void 
  }) => (
    <div className="flex-1 bg-bg-base border border-bg-elevated rounded-2xl overflow-hidden flex flex-col h-[600px]">
      <div className="p-4 border-b border-bg-elevated bg-bg-surface flex justify-between items-center">
        <h3 className="font-bold text-text-primary text-lg">{team.name}</h3>
        <span className={`text-sm font-bold px-3 py-1 rounded-full ${selected.length === 11 ? 'bg-green-500/20 text-green-400' : 'bg-bg-elevated text-text-secondary'}`}>
          {selected.length} / 11 Selected
        </span>
      </div>
      
      <div className="overflow-y-auto flex-1 p-2 space-y-1">
        {team.roster.length === 0 ? (
          <div className="text-center p-8 text-text-muted">No players in roster. Enroll players first.</div>
        ) : (
          team.roster.map(player => {
            const isSelected = selected.includes(player.id)
            const isCap = cap === player.id
            const isWk = wk === player.id

            return (
              <div 
                key={player.id} 
                className={`flex items-center justify-between p-3 rounded-xl cursor-pointer border transition-colors ${
                  isSelected ? 'bg-brand-primary/10 border-brand-primary/30' : 'bg-transparent border-transparent hover:bg-bg-elevated'
                }`}
                onClick={() => togglePlayer(teamNum, player.id)}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors ${
                    isSelected ? 'bg-brand-primary border-brand-primary text-white' : 'border-text-muted text-transparent'
                  }`}>
                    <Check size={14} strokeWidth={3} />
                  </div>
                  <div>
                    <p className={`font-bold ${isSelected ? 'text-text-primary' : 'text-text-secondary'}`}>{player.name}</p>
                    <p className="text-xs text-text-muted">{player.role || 'Player'}</p>
                  </div>
                </div>

                {isSelected && (
                  <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
                    <button 
                      onClick={() => setCap(isCap ? null as any : player.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isCap ? 'bg-yellow-500/20 text-yellow-500' : 'hover:bg-bg-elevated text-text-muted'
                      }`}
                      title="Captain"
                    >
                      <Crown size={16} />
                    </button>
                    <button 
                      onClick={() => setWk(isWk ? null as any : player.id)}
                      className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                        isWk ? 'bg-blue-500/20 text-blue-500' : 'hover:bg-bg-elevated text-text-muted'
                      }`}
                      title="Wicket Keeper"
                    >
                      <Shield size={16} />
                    </button>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )

  return (
    <Card className="bg-bg-surface border-bg-elevated overflow-hidden mt-8">
      <div className="bg-bg-base px-6 py-4 border-b border-bg-elevated flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="text-brand-primary" size={24} />
          <h2 className="text-xl font-bold text-text-primary">Select Playing XI</h2>
        </div>
        <Button 
          variant="primary" 
          onClick={handleSave} 
          isLoading={isPending}
          disabled={team1Selected.length !== 11 || team2Selected.length !== 11}
        >
          Lock Playing XI & Start Match
        </Button>
      </div>
      
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <TeamColumn 
            teamNum={1} 
            team={team1} 
            selected={team1Selected} 
            cap={team1Cap} setCap={setTeam1Cap}
            wk={team1Wk} setWk={setTeam1Wk}
          />
          <TeamColumn 
            teamNum={2} 
            team={team2} 
            selected={team2Selected} 
            cap={team2Cap} setCap={setTeam2Cap}
            wk={team2Wk} setWk={setTeam2Wk}
          />
        </div>
      </CardContent>
    </Card>
  )
}
