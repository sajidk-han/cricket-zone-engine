import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: Request) {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
  
  const { data: stats } = await supabase.from('player_match_stats').select('*')
  const { data: career } = await supabase.from('player_career_stats').select('*')
  const { data: matches } = await supabase.from('matches').select('id, status')
  const { data: events } = await supabase.from('ball_events').select('match_id, runs_off_bat').limit(10)

  return NextResponse.json({
    statsCount: stats?.length,
    stats,
    careerCount: career?.length,
    matches,
    eventsCount: events?.length,
    sampleEvents: events
  })
}
