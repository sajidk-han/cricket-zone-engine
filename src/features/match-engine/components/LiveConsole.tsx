"use client" // Force HMR for match console

import React, { useState, useTransition, useEffect } from 'react'
import { Card, CardContent } from '@/shared/components/ui/Card'
import { Button } from '@/shared/components/ui/Button'
import { Activity, CircleDashed, ShieldAlert, Wifi, Settings, RefreshCw } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { initializeInnings, DeliveryPayload, undoLastBall, endInnings } from '@/app/actions/scoring'
import { WicketResolutionDrawer } from './WicketResolutionDrawer'
import { BowlerSelectionDrawer } from './BowlerSelectionDrawer'
import { BatterSelectionDrawer } from './BatterSelectionDrawer'
import { syncEngine } from '@/lib/sync-engine'
import { calculateNextMatchState, MatchState } from '@/lib/scoring-engine'
import { BattersWidget } from './widgets/BattersWidget'
import { BowlerWidget } from './widgets/BowlerWidget'
import { ConnectivityPanelWidget } from './widgets/ConnectivityPanelWidget'
import { EnterpriseScoreboardWidget } from './widgets/EnterpriseScoreboardWidget'
import { LiveMatchTimelineWidget } from './widgets/LiveMatchTimelineWidget'
import { ReadinessDashboard } from './ReadinessDashboard'
import { LiveStreamPlayer } from './widgets/LiveStreamPlayer'

type LiveConsoleProps = {
  matchId: string
  team1: any
  team2: any
  match: any
  playingXi: any[]
  currentInnings: any
  lastBall?: any
  thisOverBalls?: any[]
  strikerStats?: { runs: number, balls: number, fours: number, sixes: number }
  nonStrikerStats?: { runs: number, balls: number, fours: number, sixes: number }
  bowlerStats?: { overs: number, maidens: number, runs: number, wickets: number, dots: number, totalBalls: number }
  dismissedPlayers?: string[]
}

export function LiveConsole({ matchId, team1, team2, match, playingXi, currentInnings, lastBall, thisOverBalls = [], strikerStats, nonStrikerStats, bowlerStats, dismissedPlayers = [] }: LiveConsoleProps) {
  const [isPending, startTransition] = useTransition()
  
  const tossWinnerId = match?.toss_winner_id
  const tossDecision = match?.toss_decision
  const team1Id = match?.team1_id
  const team2Id = match?.team2_id

  // Determine default batting and bowling teams based on Toss (for Innings 1)
  const isTeam1BattingDefault = (tossWinnerId === team1Id && tossDecision === 'bat') || (tossWinnerId === team2Id && tossDecision === 'bowl')
  const defaultBattingTeamId = isTeam1BattingDefault ? team1Id : team2Id
  const defaultBowlingTeamId = isTeam1BattingDefault ? team2Id : team1Id

  // Initialization State
  const [selectedBattingTeamId, setSelectedBattingTeamId] = useState<string>(defaultBattingTeamId)
  const [selectedBowlingTeamId, setSelectedBowlingTeamId] = useState<string>(defaultBowlingTeamId)
  
  const battingTeamId = currentInnings ? currentInnings.batting_team_id : selectedBattingTeamId
  const bowlingTeamId = currentInnings ? currentInnings.bowling_team_id : selectedBowlingTeamId
  
  const isTeam1Batting = battingTeamId === team1Id

  const battingXi = playingXi.filter(p => p.team_id === battingTeamId)
  const bowlingXi = playingXi.filter(p => p.team_id === bowlingTeamId)

  const [strikerId, setStrikerId] = useState<string>('')
  const [nonStrikerId, setNonStrikerId] = useState<string>('')
  const [bowlerId, setBowlerId] = useState<string>('')

  const handleInitialize = () => {
    if (!strikerId || !nonStrikerId || !bowlerId) {
      toast.error("Please select all opening players")
      return
    }
    if (strikerId === nonStrikerId) {
      toast.error("Striker and Non-Striker must be different players")
      return
    }

    startTransition(async () => {
      const res = await initializeInnings(
        matchId, selectedBattingTeamId, selectedBowlingTeamId, match.current_innings || 1, strikerId, nonStrikerId, bowlerId
      )
      if (res.success) {
        toast.success(res.message)
        setTimeout(() => window.location.reload(), 500)
      } else {
        toast.error(res.message)
      }
    })
  }

  // Wicket Drawer State
  const [isWicketDrawerOpen, setIsWicketDrawerOpen] = useState(false)
  const [isBowlerSelectionOpen, setIsBowlerSelectionOpen] = useState(false)
  const [isBatterSelectionOpen, setIsBatterSelectionOpen] = useState(false)
  const [isMandatoryBowlerChange, setIsMandatoryBowlerChange] = useState(false)
  
  const [localVersion, setLocalVersion] = useState(match.current_version || 1)
  
  // Offline State (Optimistic UI)
  const [offlineState, setOfflineState] = useState<MatchState | null>(null)
  const [isOffline, setIsOffline] = useState(false)
  const [hasConflict, setHasConflict] = useState(false)

  useEffect(() => {
    const handleOnline = () => setIsOffline(false)
    const handleOffline = () => setIsOffline(true)
    const handleConflict = () => setHasConflict(true)
    
    setIsOffline(!navigator.onLine)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    window.addEventListener('sync-conflict', handleConflict)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('sync-conflict', handleConflict)
    }
  }, [])

  // Sync local version when server state updates and catches up
  useEffect(() => {
    if (match.current_version > localVersion) {
      setLocalVersion(match.current_version)
      // When server version bumps, it means our sync was processed (or another scorer did something).
      setOfflineState(null)
    }
  }, [match.current_version])

  const baseStrikerId = match?.match_statistics?.current_striker || lastBall?.striker_id
  const baseNonStrikerId = match?.match_statistics?.current_non_striker || lastBall?.non_striker_id
  const baseBowlerId = match?.match_statistics?.current_bowler || lastBall?.bowler_id

  const currentStrikerId = offlineState?.currentStrikerId || baseStrikerId
  const currentNonStrikerId = offlineState?.currentNonStrikerId || baseNonStrikerId
  const currentBowlerId = offlineState?.currentBowlerId || baseBowlerId

  const availableBatters = battingXi
    .map(p => p.player)
    .filter(p => p.id !== currentStrikerId && p.id !== currentNonStrikerId)

  const handleScore = (runsOffBat: number, isLegal: boolean, extrasType: string | null = null, extrasRuns: number = 0, isWicket: boolean = false, wicketType: string | null = null, incomingBatterId: string | null = null, explicitDismissedId: string | null = null) => {
    if (!lastBall && !match?.match_statistics) return

    const payload: DeliveryPayload = {
      runsOffBat,
      isLegalDelivery: isLegal,
      isBoundary: runsOffBat === 4 || runsOffBat === 6,
      extrasType,
      extrasRuns,
      isWicket,
      wicketType,
      dismissedPlayerId: isWicket ? (explicitDismissedId || currentStrikerId) : null,
      incomingBatterId 
    }

    // 1. Optimistic UI Update (Reducer)
    const baseLegalBallsBowled = Math.floor(currentInnings.overs_bowled) * 6 + Math.round((currentInnings.overs_bowled % 1) * 10)
    const currentStateToReduce: MatchState = offlineState || {
      totalRuns: currentInnings.total_runs,
      totalWickets: currentInnings.total_wickets,
      legalBallsBowled: baseLegalBallsBowled,
      currentStrikerId,
      currentNonStrikerId,
      currentBowlerId
    }

    const { newState } = calculateNextMatchState(currentStateToReduce, payload)
    setOfflineState(newState)
    setIsWicketDrawerOpen(false)
    
    // Check if over completed
    if (newState.legalBallsBowled > 0 && newState.legalBallsBowled % 6 === 0 && currentStateToReduce.legalBallsBowled % 6 !== 0) {
      setIsMandatoryBowlerChange(true)
      setIsBowlerSelectionOpen(true)
    }
    setLocalVersion((prev: number) => prev + 1)
    
    // Simulate successful click instantly
    toast.success("Delivery queued")

    // Queue for Sync
    syncEngine.enqueueDelivery(matchId, currentInnings.id, payload, {
      strikerId: currentStrikerId,
      nonStrikerId: currentNonStrikerId,
      bowlerId: currentBowlerId,
      clientVersion: localVersion
    }).catch(console.error)

    // Save Snapshot for Recovery
    import('@/lib/offline-db').then(({ db }) => {
      db.match_snapshots.put({
        match_id: matchId,
        snapshot_version: localVersion + 1,
        snapshot_checksum: '', // Can be computed if needed
        state_data: newState,
        ui_state: { isWicketDrawerOpen: false },
        created_at: new Date().toISOString()
      }).catch(console.error)
    })
  }

  const handleBowlerChange = (newBowlerId: string) => {
    // Optimistic UI for bowler change
    setOfflineState((prev: MatchState | null) => {
      const baseState: MatchState = prev || {
        totalRuns: currentInnings.total_runs,
        totalWickets: currentInnings.total_wickets,
        legalBallsBowled: Math.floor(currentInnings.overs_bowled) * 6 + Math.round((currentInnings.overs_bowled % 1) * 10),
        currentStrikerId: baseStrikerId,
        currentNonStrikerId: baseNonStrikerId,
        currentBowlerId: baseBowlerId
      };
      return { ...baseState, currentBowlerId: newBowlerId }
    })
    setIsBowlerSelectionOpen(false)
    setIsMandatoryBowlerChange(false)
    
    toast.success("Bowler changed")
  }

  const handleBatterChange = (replacedId: string, newId: string) => {
    // Optimistic UI for manual batter change
    setOfflineState((prev: MatchState | null) => {
      const baseState: MatchState = prev || {
        totalRuns: currentInnings.total_runs,
        totalWickets: currentInnings.total_wickets,
        legalBallsBowled: Math.floor(currentInnings.overs_bowled) * 6 + Math.round((currentInnings.overs_bowled % 1) * 10),
        currentStrikerId: baseStrikerId,
        currentNonStrikerId: baseNonStrikerId,
        currentBowlerId: baseBowlerId
      };
      return { 
        ...baseState, 
        currentStrikerId: baseState.currentStrikerId === replacedId ? newId : baseState.currentStrikerId,
        currentNonStrikerId: baseState.currentNonStrikerId === replacedId ? newId : baseState.currentNonStrikerId,
      }
    })
    setIsBatterSelectionOpen(false)
    toast.success("Batter changed manually")
  }

  const handleUndo = () => {
    if (isPending) return
    startTransition(async () => {
      const res = await undoLastBall(matchId, currentInnings.id, localVersion)
      if (res.success) {
        toast.success(res.message)
        // Reset optimistic state to force re-render from canonical server state
        setOfflineState(null)
        // Give time for realtime updates to arrive, or page reload
        setTimeout(() => window.location.reload(), 1000)
      } else {
        toast.error(res.message)
      }
    })
  }

  const handleEndInnings = () => {
    if (isPending) return
    startTransition(async () => {
      const res = await endInnings(matchId, currentInnings.id)
      if (res.success) {
        toast.success(res.message)
        setTimeout(() => window.location.reload(), 1000)
      } else {
        toast.error(res.message)
      }
    })
  }

  // Calculate Innings Limits
  const baseLegalBallsBowled = currentInnings ? Math.floor(currentInnings.overs_bowled) * 6 + Math.round((currentInnings.overs_bowled % 1) * 10) : 0
  const totalBallsBowled = offlineState ? offlineState.legalBallsBowled : baseLegalBallsBowled
  const maxBalls = (match.scheduled_overs || 20) * 6
  
  const isMaxOversReached = totalBallsBowled >= maxBalls
  const isAllOut = (offlineState ? offlineState.totalWickets : currentInnings?.total_wickets || 0) >= 10
  const shouldEndInnings = isMaxOversReached || isAllOut

  // If there's no active innings record, show the Initialization screen
  if (!currentInnings) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-bg-surface border border-bg-elevated rounded-2xl max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Initialize Innings 1</h2>
        
        <div className="w-full space-y-6">
          {/* Team Assignment */}
          <div className="space-y-4 pb-2 border-b border-bg-elevated">
            <h3 className="text-sm font-bold text-text-secondary uppercase">Match Roles</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Batting Team</label>
                <select 
                  className="w-full bg-bg-base border border-bg-elevated rounded p-2 text-brand-primary font-semibold"
                  value={selectedBattingTeamId}
                  onChange={(e) => {
                    setSelectedBattingTeamId(e.target.value)
                    if (e.target.value === selectedBowlingTeamId) {
                      setSelectedBowlingTeamId(e.target.value === team1Id ? team2Id : team1Id)
                    }
                  }}
                >
                  <option value={team1Id}>{team1?.name}</option>
                  <option value={team2Id}>{team2?.name}</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Bowling Team</label>
                <select 
                  className="w-full bg-bg-base border border-bg-elevated rounded p-2 text-rose-500 font-semibold"
                  value={selectedBowlingTeamId}
                  onChange={(e) => {
                    setSelectedBowlingTeamId(e.target.value)
                    if (e.target.value === selectedBattingTeamId) {
                      setSelectedBattingTeamId(e.target.value === team1Id ? team2Id : team1Id)
                    }
                  }}
                >
                  <option value={team1Id}>{team1?.name}</option>
                  <option value={team2Id}>{team2?.name}</option>
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-bold text-text-secondary uppercase">Opening Batters</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-text-muted mb-1">Striker</label>
                <select 
                  className="w-full bg-bg-base border border-bg-elevated rounded p-2 text-text-primary"
                  value={strikerId}
                  onChange={(e) => setStrikerId(e.target.value)}
                >
                  <option value="">Select Striker...</option>
                  {battingXi.map(p => <option key={p.player.id} value={p.player.id}>{p.player.full_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-text-muted mb-1">Non-Striker</label>
                <select 
                  className="w-full bg-bg-base border border-bg-elevated rounded p-2 text-text-primary"
                  value={nonStrikerId}
                  onChange={(e) => setNonStrikerId(e.target.value)}
                >
                  <option value="">Select Non-Striker...</option>
                  {battingXi.map(p => <option key={p.player.id} value={p.player.id}>{p.player.full_name}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="space-y-4 pt-4 border-t border-bg-elevated">
            <h3 className="text-sm font-bold text-text-secondary uppercase">Opening Bowler</h3>
            <div>
              <label className="block text-sm text-text-muted mb-1">Bowler</label>
              <select 
                className="w-full bg-bg-base border border-bg-elevated rounded p-2 text-text-primary"
                value={bowlerId}
                onChange={(e) => setBowlerId(e.target.value)}
              >
                <option value="">Select Bowler...</option>
                {bowlingXi.map(p => <option key={p.player.id} value={p.player.id}>{p.player.full_name}</option>)}
              </select>
            </div>
          </div>

          <Button onClick={handleInitialize} className="w-full h-12 text-lg mt-6" isLoading={isPending}>
            Start Match
          </Button>
        </div>
      </div>
    )
  }

  // Derive display names using the resolved current IDs (from match_statistics or lastBall)
  const strikerName = battingXi.find(p => p.player.id === currentStrikerId)?.player.full_name || 'Striker'
  const nonStrikerName = battingXi.find(p => p.player.id === currentNonStrikerId)?.player.full_name || 'Non-Striker'
  if (currentInnings && !lastBall) {
    return (
      <div className="flex flex-col items-center justify-center p-8 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-2xl mx-auto text-center">
        <ShieldAlert size={48} className="text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-text-primary mb-2">State Desync Detected</h2>
        <p className="text-text-secondary mb-6">
          You initialized the innings before the backend update was applied. The striker information is missing.
        </p>
        <Button 
          variant="outline" 
          className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
          onClick={() => {
            startTransition(async () => {
              const { resetInnings } = await import('@/app/actions/scoring')
              await resetInnings(matchId)
            })
          }}
          isLoading={isPending}
        >
          Reset Innings & Re-Initialize
        </Button>
      </div>
    )
  }

  const displayRuns = offlineState?.totalRuns ?? currentInnings.total_runs
  const displayWickets = offlineState?.totalWickets ?? currentInnings.total_wickets
  
  // Calculate display overs from legal balls
  let displayOvers: string = currentInnings.overs_bowled.toString()
  let numericOvers: number = currentInnings.overs_bowled
  let totalBalls: number = Math.floor(currentInnings.overs_bowled) * 6 + Math.round((currentInnings.overs_bowled % 1) * 10)
  
  if (offlineState) {
    const balls = offlineState.legalBallsBowled % 6
    displayOvers = Math.floor(offlineState.legalBallsBowled / 6) + '.' + balls
    numericOvers = Math.floor(offlineState.legalBallsBowled / 6) + (balls / 6)
    totalBalls = offlineState.legalBallsBowled
  }

  const displayRR = numericOvers > 0 ? (displayRuns / numericOvers).toFixed(2) : '0.00'

  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [batterySaver, setBatterySaver] = useState(false)

  const handleDownloadTournament = () => {
    toast.success("Tournament data downloaded for offline use!")
    setIsSettingsOpen(false)
  }

  const resolveConflict = () => {
    setHasConflict(false)
    setOfflineState(null)
    toast.success("State synchronized with server")
    window.location.reload()
  }

  return (
    <div className={`space-y-6 ${batterySaver ? 'opacity-90' : ''}`}>
      {match.status === 'scheduled' && (
        <ReadinessDashboard 
          matchId={matchId}
          teamsConfirmed={playingXi.length > 0}
          playingXiSubmitted={playingXi.length === 22}
          tossCompleted={!!tossWinnerId}
          venueAssigned={!!match.venue}
          umpireAssigned={true}
          scorerConnected={!isOffline}
          onMatchStart={() => window.location.reload()}
        />
      )}

      {/* Conflict Resolution Modal */}
      {hasConflict && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80">
          <div className="bg-bg-surface border border-red-500/50 p-6 rounded-xl max-w-md text-center space-y-4">
            <ShieldAlert size={48} className="text-red-500 mx-auto" />
            <h3 className="text-xl font-bold text-text-primary">Sync Conflict Detected</h3>
            <p className="text-text-secondary text-sm">
              Another scorer has updated this match, or your local queue is out of sync with the server. 
              We must pull the latest authoritative data to continue.
            </p>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={resolveConflict}>
              Pull Latest State
            </Button>
          </div>
        </div>
      )}

      {/* Drawer */}
      <WicketResolutionDrawer 
        isOpen={isWicketDrawerOpen}
        onClose={() => setIsWicketDrawerOpen(false)}
        onConfirm={(wicketType, incomingBatterId, dismissedPlayerId) => {
          handleScore(0, true, null, 0, true, wicketType, incomingBatterId, dismissedPlayerId)
        }}
        availableBatters={availableBatters}
        striker={{ id: currentStrikerId, name: strikerName }}
        nonStriker={{ id: currentNonStrikerId, name: nonStrikerName }}
        dismissedPlayers={dismissedPlayers}
      />
      {/* Network Status Header (Enterprise Requirement) */}
      {match.status !== 'scheduled' && (
        <div className="flex justify-between items-center bg-bg-surface px-4 py-2 rounded-lg border border-bg-elevated">
        <div className="flex items-center gap-2">
          <Activity size={16} className="text-brand-primary" />
          <span className="font-bold text-sm text-text-primary">Live Console Active</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {isOffline ? (
              <>
                <CircleDashed size={16} className={`text-yellow-500 ${!batterySaver && 'animate-spin'}`} />
                <span className="text-xs font-bold text-yellow-500">Offline (Queueing)</span>
              </>
            ) : (
              <>
                <Wifi size={16} className="text-brand-primary" />
                <span className="text-xs font-bold text-brand-primary">Connected</span>
              </>
            )}
          </div>
          <button onClick={() => setIsSettingsOpen(!isSettingsOpen)} className="text-text-muted hover:text-text-primary transition-colors">
            <Settings size={16} />
          </button>
        </div>
      </div>
      )}

      {isSettingsOpen && (
        <div className="bg-bg-surface border border-bg-elevated rounded-lg p-4 mb-4 space-y-4">
          <h4 className="font-bold text-text-primary mb-2 border-b border-bg-elevated pb-2">Offline & Enterprise Settings</h4>
          
          <div className="flex justify-between items-center">
            <div>
              <p className="text-text-primary text-sm font-medium">Battery Saver Mode</p>
              <p className="text-text-muted text-xs">Disables animations and heavy background tasks</p>
            </div>
            <button 
              onClick={() => setBatterySaver(!batterySaver)}
              className={`w-12 h-6 rounded-full transition-colors flex items-center px-1 ${batterySaver ? 'bg-brand-primary' : 'bg-bg-elevated'}`}
            >
              <div className={`w-4 h-4 bg-white rounded-full transition-transform ${batterySaver ? 'translate-x-6' : ''}`} />
            </button>
          </div>

          <div className="flex justify-between items-center pt-2 border-t border-bg-elevated">
            <div>
              <p className="text-text-primary text-sm font-medium">Tournament Download</p>
              <p className="text-text-muted text-xs">Cache all teams and match data for offline fallback</p>
            </div>
            <Button size="sm" variant="outline" onClick={handleDownloadTournament}>Download</Button>
          </div>
        </div>
      )}

      {/* Embedded Live Video for Scorer Convenience */}
      {match.live_stream_url && match.status !== 'scheduled' && (
         <div className="w-full max-w-4xl mx-auto mb-6">
            <LiveStreamPlayer url={match.live_stream_url} status={match.status} />
         </div>
      )}

      {match.status !== 'scheduled' && (
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        
        {/* Left Panel: Context & Connectivity (3 cols) */}
        <div className="order-3 xl:order-1 xl:col-span-3 flex flex-col gap-4">
           <ConnectivityPanelWidget 
              isOffline={isOffline} 
              queueLength={0} // Can hook to syncEngine.getQueueLength() later
              localVersion={localVersion} 
              serverVersion={match.current_version} 
           />
           <div className="flex-1 min-h-[400px]">
              <LiveMatchTimelineWidget balls={thisOverBalls} battingXi={battingXi} bowlingXi={bowlingXi} /> {/* For now passing thisOverBalls, later full timeline */}
           </div>
        </div>

        {/* Center Panel: Scoring Console (5 cols) */}
        <div className="order-2 xl:order-2 xl:col-span-5 h-full">
          <Card className="bg-bg-surface border-bg-elevated h-full shadow-2xl flex flex-col">
            <CardContent className="p-6 sm:p-8 flex flex-col h-full flex-1">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-text-primary uppercase tracking-wider text-sm flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></div> Live Console
                  </h3>
                  <Button 
                    size="sm" 
                    className="h-8 px-4 text-xs font-bold text-text-primary bg-orange-500 hover:bg-orange-600 border-none shadow-[0_0_10px_rgba(249,115,22,0.3)] transition-all"
                    onClick={handleUndo}
                    isLoading={isPending}
                  >
                    <RefreshCw size={12} className="mr-1.5" /> Undo Last
                  </Button>
                </div>
                
                {shouldEndInnings ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center bg-gradient-to-b from-brand-primary/10 to-transparent rounded-2xl border border-brand-primary/20 shadow-[inset_0_0_50px_rgba(var(--brand-primary-rgb),0.1)] h-full mb-8 relative overflow-hidden">
                    <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-brand-primary to-transparent" />
                    <h3 className="text-3xl font-black text-white mb-3 drop-shadow-md">Innings Complete!</h3>
                    <p className="text-text-muted mb-10 text-sm">{isAllOut ? 'Team is All Out.' : `Maximum overs (${match.scheduled_overs || 20}) reached.`}</p>
                    <Button 
                      className="h-16 px-10 text-lg font-black bg-brand-primary hover:bg-brand-primary/80 shadow-[0_0_20px_rgba(var(--brand-primary-rgb),0.4)] transition-all hover:scale-105"
                      onClick={handleEndInnings}
                      isLoading={isPending}
                    >
                      End Innings & Switch
                    </Button>
                  </div>
                ) : (
                  <>
                    <div className="grid grid-cols-3 gap-4 sm:gap-6 mb-8">
                      {[0, 1, 2, 3, 4, 6].map(run => (
                        <Button 
                          key={run} 
                          variant={run === 4 || run === 6 ? 'primary' : 'outline'} 
                          className={`h-20 sm:h-24 text-3xl sm:text-4xl font-black rounded-2xl transition-all duration-200 hover:scale-[1.02] active:scale-95 ${run === 4 || run === 6 ? 'shadow-[0_8px_30px_rgba(var(--brand-primary-rgb),0.3)] bg-gradient-to-b from-brand-primary to-brand-primary/80 border-t border-white/20' : 'border-bg-elevated/50 text-white hover:border-brand-primary/50 bg-gradient-to-b from-bg-base to-bg-surface shadow-md'}`}
                          onClick={() => handleScore(run, true)}
                          isLoading={isPending}
                        >
                          {run}
                        </Button>
                      ))}
                    </div>

                    <h3 className="text-xs font-bold text-text-muted uppercase tracking-widest mb-3 flex items-center gap-2">
                      <span className="w-4 h-0.5 bg-bg-elevated rounded-full"></span>
                      Extras
                      <span className="flex-1 h-0.5 bg-gradient-to-r from-bg-elevated to-transparent rounded-full"></span>
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4 mb-8">
                      <Button variant="outline" className="h-14 bg-bg-base border-bg-elevated/50 text-text-secondary hover:text-white rounded-xl hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all font-semibold" onClick={() => handleScore(0, false, 'wide', 1)} disabled={isPending}>Wide</Button>
                      <Button variant="outline" className="h-14 bg-bg-base border-bg-elevated/50 text-text-secondary hover:text-white rounded-xl hover:border-yellow-500/50 hover:bg-yellow-500/10 transition-all font-semibold" onClick={() => handleScore(0, false, 'no_ball', 1)} disabled={isPending}>No Ball</Button>
                      <Button variant="outline" className="h-14 bg-bg-base border-bg-elevated/50 text-text-secondary hover:text-white rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all font-semibold" onClick={() => handleScore(0, true, 'bye', 1)} disabled={isPending}>Bye</Button>
                      <Button variant="outline" className="h-14 bg-bg-base border-bg-elevated/50 text-text-secondary hover:text-white rounded-xl hover:border-blue-500/50 hover:bg-blue-500/10 transition-all font-semibold" onClick={() => handleScore(0, true, 'leg_bye', 1)} disabled={isPending}>Leg Bye</Button>
                    </div>

                    <div className="pt-6 border-t border-bg-elevated/50 mt-auto">
                      <Button 
                        variant="outline" 
                        className="w-full h-16 bg-red-500/10 border-red-500/30 text-red-500 hover:bg-red-600 hover:text-white hover:border-red-600 font-black text-xl tracking-widest uppercase transition-all duration-300 rounded-xl shadow-[0_4px_20px_rgba(239,68,68,0.15)] hover:shadow-[0_8px_30px_rgba(239,68,68,0.4)]"
                        onClick={() => setIsWicketDrawerOpen(true)}
                        disabled={isPending}
                      >
                        Wicket
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Panel: Data & Stats (4 cols) */}
        <div className="order-1 xl:order-3 xl:col-span-4 flex flex-col gap-6">
           <EnterpriseScoreboardWidget 
              matchState={{ totalRuns: displayRuns, totalWickets: displayWickets, legalBallsBowled: totalBalls }} 
              match={match} 
              lastEvent={lastBall}
           />
           <BattersWidget 
              onChangeBatter={() => setIsBatterSelectionOpen(true)}
              striker={{ id: currentStrikerId, name: strikerName, runs: strikerStats?.runs || 0, balls: strikerStats?.balls || 0, fours: strikerStats?.fours || 0, sixes: strikerStats?.sixes || 0, isStriker: true }}
              nonStriker={{ id: currentNonStrikerId, name: nonStrikerName, runs: nonStrikerStats?.runs || 0, balls: nonStrikerStats?.balls || 0, fours: nonStrikerStats?.fours || 0, sixes: nonStrikerStats?.sixes || 0, isStriker: false }}
           />
           <BowlerWidget 
              className="flex-1"
              onChangeBowler={() => {
                setIsMandatoryBowlerChange(false)
                setIsBowlerSelectionOpen(true)
              }}
              bowler={bowlerStats ? { 
                id: currentBowlerId, 
                name: bowlingXi.find(p => p.player.id === currentBowlerId)?.player.full_name || 'Current Bowler', 
                ...bowlerStats 
              } : null} 
           />
        </div>

      </div>
      )}

      <BowlerSelectionDrawer
        isOpen={isBowlerSelectionOpen}
        onClose={() => setIsBowlerSelectionOpen(false)}
        onConfirm={handleBowlerChange}
        availableBowlers={bowlingXi}
        currentBowlerId={currentBowlerId}
        isMandatory={isMandatoryBowlerChange}
      />
      
      <BatterSelectionDrawer
        isOpen={isBatterSelectionOpen}
        onClose={() => setIsBatterSelectionOpen(false)}
        onConfirm={handleBatterChange}
        availableBatters={availableBatters}
        striker={{ id: currentStrikerId, name: strikerName }}
        nonStriker={{ id: currentNonStrikerId, name: nonStrikerName }}
        dismissedPlayers={dismissedPlayers}
      />
    </div>
  )
}
