"use server"

import { createAdminClient } from '@/lib/supabase-server'
import { unstable_cache } from 'next/cache'

// Use Next.js unstable_cache to fulfill the caching requirements from the blueprint
// Caches are revalidated every X seconds (e.g., 300 = 5 mins)

export const getPublicOrganizations = unstable_cache(
  async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('organizations')
      .select('id, name, slug, branding_config')
      .eq('status', 'approved')
      .limit(20)
    
    if (error) throw new Error(error.message)
    return data || []
  },
  ['public_organizations'],
  { revalidate: 120 } // 2 Minute Cache
)

export const getLiveMatches = async () => {
  // Realtime matches should NOT be cached, as per blueprint
  const supabase = createAdminClient()
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, status, match_type, current_innings,
      team1:team1_id(id, name, short_name, logo_url),
      team2:team2_id(id, name, short_name, logo_url),
      tournament:tournament_id(name),
      organization:org_id(name, slug)
    `)
    .in('status', ['live', 'innings_break'])
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (error) throw new Error(error.message)
  return data || []
}

export const getUpcomingFixtures = unstable_cache(
  async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id, status, scheduled_time,
        team1:team1_id(name, short_name),
        team2:team2_id(name, short_name),
        tournament:tournament_id(name)
      `)
      .eq('status', 'scheduled')
      .order('scheduled_time', { ascending: true })
      .limit(10)
    
    if (error) throw new Error(error.message)
    return data || []
  },
  ['public_upcoming_fixtures'],
  { revalidate: 300 } // 5 Minute Cache
)

export const getRecentResults = unstable_cache(
  async () => {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from('matches')
      .select(`
        id, status, result_type, result_reason,
        team1:team1_id(name, short_name),
        team2:team2_id(name, short_name),
        winning_team:winning_team_id(name)
      `)
      .eq('status', 'completed')
      .order('end_time', { ascending: false })
      .limit(10)
    
    if (error) throw new Error(error.message)
    return data || []
  },
  ['public_recent_results'],
  { revalidate: 300 } // 5 Minute Cache
)
