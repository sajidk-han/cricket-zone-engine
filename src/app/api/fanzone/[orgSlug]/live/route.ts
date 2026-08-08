import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

// Avoid caching live routes
export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgSlug: string }> }
) {
  try {
    const supabase = createAdminClient()
    const resolvedParams = await params
    const orgSlug = resolvedParams.orgSlug

    // Resolve Organization ID from Slug
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('slug', orgSlug)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // Fetch Live Matches
    const { data: liveMatches, error } = await supabase
      .from('matches')
      .select(`
        id, slug, status, team1_id, team2_id, toss_winner_id, toss_decision,
        team1:teams!matches_team1_id_fkey(id, name, short_name, logo_url),
        team2:teams!matches_team2_id_fkey(id, name, short_name, logo_url),
        tournament:tournaments(id, name, slug),
        match_statistics(
           current_striker, current_non_striker, current_bowler,
           team1_runs, team1_wickets, team1_overs,
           team2_runs, team2_wickets, team2_overs,
           target_score
        )
      `)
      .eq('org_id', org.id)
      .eq('status', 'live')
      .order('start_time', { ascending: false })

    if (error) throw error

    return NextResponse.json({
      organization: org,
      liveMatches: liveMatches || []
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
