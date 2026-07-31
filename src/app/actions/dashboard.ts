"use server"

import { supabase } from '@/lib/supabase'

export async function fetchDashboardStats() {
  const [
    { count: activeTournaments },
    { count: registeredTeams },
    { count: totalPlayers }
  ] = await Promise.all([
    supabase.from('tournaments').select('*', { count: 'exact', head: true }).in('status', ['scheduled', 'ongoing']),
    supabase.from('teams').select('*', { count: 'exact', head: true }),
    supabase.from('players').select('*', { count: 'exact', head: true })
  ])

  // Get recent activity (last 4 items)
  const { data: recentTournaments } = await supabase
    .from('tournaments')
    .select('name, created_at')
    .order('created_at', { ascending: false })
    .limit(4)

  return {
    activeTournaments: activeTournaments || 0,
    registeredTeams: registeredTeams || 0,
    totalPlayers: totalPlayers || 0,
    recentTournaments: recentTournaments || []
  }
}
