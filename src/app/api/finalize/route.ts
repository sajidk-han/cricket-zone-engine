import { NextResponse } from 'next/server'
import { MatchFinalizationEngine } from '@/lib/match-finalization-engine'
import { createClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const matchId = searchParams.get('matchId')
    
    if (!matchId) {
       // If no matchId provided, finalize all completed matches!
       const supabase = await createClient()
       const { data: matches } = await supabase.from('matches').select('id')
       
       if (matches) {
         for (const m of matches) {
            await MatchFinalizationEngine.finalizeMatch(m.id)
         }
       }
       return NextResponse.json({ success: true, message: `Finalized ${matches?.length} matches.` })
    }

    await MatchFinalizationEngine.finalizeMatch(matchId)
    return NextResponse.json({ success: true, matchId })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message, stack: error.stack }, { status: 500 })
  }
}
