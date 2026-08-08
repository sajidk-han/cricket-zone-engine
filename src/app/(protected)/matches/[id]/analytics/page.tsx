import React from 'react'
import { getMatchSummary } from '@/app/actions/matches'
import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase-server'
import { WormGraph } from '@/features/match-engine/components/charts/WormGraph'
import { ManhattanGraph } from '@/features/match-engine/components/charts/ManhattanGraph'
import { AnalyticsEngine } from '@/lib/analytics-engine'

export default async function MatchAnalyticsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params
  const res = await getMatchSummary(resolvedParams.id)
  if (!res.success || !res.data) notFound()
  const match = res.data

  const supabase = await createClient()
  const { data: allInnings } = await supabase.from('innings').select('id, batting_team_id').eq('match_id', match.id)
  const inningsIds = allInnings?.map((i: any) => i.id) || []
  
  let allBallsRaw: any[] = []
  if (inningsIds.length > 0) {
    const { data } = await supabase.from('ball_events').select('*, innings(batting_team_id)').in('innings_id', inningsIds).order('created_at', { ascending: true })
    if (data) allBallsRaw = data
  }

  // Pre-process Data using AnalyticsEngine
  const wormData = AnalyticsEngine.generateWormGraphData(match.team1.id, match.team2.id, allBallsRaw, 20)
  
  // Process balls for Manhattan Graph
  const analyticsBalls = allBallsRaw.map(b => ({
    overNumber: b.over_number,
    ballNumber: b.ball_number,
    runs: (b.runs_off_bat || 0) + (b.extras_runs || 0),
    isWicket: b.is_wicket || !!b.wicket_type,
    isLegal: true,
    teamId: b.innings?.batting_team_id
  }))
  
  // Use team 1's innings if they have balls, else team 2
  const team1Balls = analyticsBalls.filter(b => b.teamId === match.team1.id)
  const targetTeamId = team1Balls.length > 0 ? match.team1.id : match.team2.id
  
  // We need to import generateManhattanData at the top, or just require it here, but actually we can just manually map it inline to avoid import issues.
  const overData: Record<number, { runs: number, wickets: number }> = {};
  let maxOver = 19; // Default 20 overs (0 to 19)

  analyticsBalls.forEach(ball => {
    if (ball.teamId !== targetTeamId) return;
    if (!overData[ball.overNumber]) {
      overData[ball.overNumber] = { runs: 0, wickets: 0 };
    }
    overData[ball.overNumber].runs += ball.runs;
    if (ball.isWicket) {
      overData[ball.overNumber].wickets += 1;
    }
  });

  const manhattanData = [];
  for (let i = 0; i <= maxOver; i++) {
    manhattanData.push({
      over: i + 1,
      runs: overData[i]?.runs || 0,
      wickets: overData[i]?.wickets || 0
    });
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WormGraph data={wormData} team1Name={match.team1.short_name} team2Name={match.team2.short_name} />
        <ManhattanGraph data={manhattanData} color="#10b981" />
      </div>
      {/* Future extensions: RunRateGraph, PartnershipGraph, WagonWheel */}
    </div>
  )
}
