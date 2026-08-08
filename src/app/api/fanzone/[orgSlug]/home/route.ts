import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-server'

// Revalidate this route every 60 seconds (or rely on fetch caching in components)
export const revalidate = 60

export async function GET(
  request: Request,
  { params }: { params: Promise<{ orgSlug: string }> }
) {
  try {
    const supabase = await createAdminClient()
    const { orgSlug } = await params

    // 1. Resolve Organization ID from Slug
    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .select('id, name')
      .eq('slug', orgSlug)
      .single()

    if (orgError || !org) {
      return NextResponse.json({ error: 'Organization not found' }, { status: 404 })
    }

    // 2. Fetch Featured / Live Matches (limit to top 5)
    const { data: liveMatches } = await supabase
      .from('matches')
      .select(`
        id, slug, status, team1_id, team2_id, 
        team1:teams!matches_team1_id_fkey(id, name, short_name, logo_url),
        team2:teams!matches_team2_id_fkey(id, name, short_name, logo_url),
        tournament:tournaments(id, name, slug)
      `)
      .eq('org_id', org.id)
      .in('status', ['live', 'scheduled', 'completed'])
      .order('status', { ascending: true }) // 'live' usually comes first alphabetically or we can custom sort
      .limit(5)

    // 3. Fetch Featured Teams
    const { data: featuredTeams } = await supabase
      .from('teams')
      .select('id, name, short_name, slug, logo_url')
      .eq('org_id', org.id)
      .limit(4)

    // 4. Fetch Recent Results
    const { data: recentResults } = await supabase
      .from('matches')
      .select(`
        id, slug, status, result_reason, winning_team_id,
        team1:teams!matches_team1_id_fkey(id, name, short_name, logo_url),
        team2:teams!matches_team2_id_fkey(id, name, short_name, logo_url),
        winning_team:teams!matches_winning_team_id_fkey(id, name)
      `)
      .eq('org_id', org.id)
      .eq('status', 'completed')
      .order('end_time', { ascending: false })
      .limit(4)

    return NextResponse.json({
      organization: org,
      liveMatches: liveMatches || [],
      featuredTeams: featuredTeams || [],
      recentResults: recentResults || []
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 })
  }
}
