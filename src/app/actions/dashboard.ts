"use server"

import { createClient } from '@/lib/supabase-server'

export async function fetchDashboardStats() {
  const supabase = await createClient()

  const [
    { count: activeTournaments },
    { count: registeredTeams },
    { count: totalPlayers },
    { count: liveMatches }
  ] = await Promise.all([
    supabase.from('tournaments').select('*', { count: 'exact', head: true }).in('status', ['scheduled', 'ongoing']).is('deleted_at', null),
    supabase.from('teams').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('players').select('*', { count: 'exact', head: true }).is('deleted_at', null),
    supabase.from('matches').select('id, team1:teams!matches_team1_id_fkey!inner(id), team2:teams!matches_team2_id_fkey!inner(id)', { count: 'exact', head: true }).eq('status', 'live').is('deleted_at', null).is('team1.deleted_at', null).is('team2.deleted_at', null)
  ])

  // Get recent activity (last 4 items)
  const { data: recentTournaments } = await supabase
    .from('tournaments')
    .select('name, created_at')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })
    .limit(4)

  // Get activity chart data (last 7 days)
  const sevenDaysAgo = new Date()
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
  sevenDaysAgo.setHours(0, 0, 0, 0)
  const sevenDaysAgoIso = sevenDaysAgo.toISOString()

  const [
    { data: recentMatches },
    { data: recentPlayers }
  ] = await Promise.all([
    supabase.from('matches').select('created_at, team1:teams!matches_team1_id_fkey!inner(id), team2:teams!matches_team2_id_fkey!inner(id)').gte('created_at', sevenDaysAgoIso).is('deleted_at', null).is('team1.deleted_at', null).is('team2.deleted_at', null),
    supabase.from('players').select('created_at').gte('created_at', sevenDaysAgoIso).is('deleted_at', null)
  ])

  // Group by day for the last 7 days
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  
  // Create an array for the last 7 days ending today
  const activityData: { name: string; matches: number; players: number; dateString: string }[] = []
  for (let i = 6; i >= 0; i--) {
    const d = new Date()
    d.setDate(d.getDate() - i)
    // Local date string YYYY-MM-DD
    const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    activityData.push({
      name: days[d.getDay()],
      matches: 0,
      players: 0,
      dateString: localDateStr
    })
  }

  // Populate matches
  if (recentMatches) {
    recentMatches.forEach((m: any) => {
      const d = new Date(m.created_at)
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const dayData = activityData.find(d => d.dateString === localDateStr)
      if (dayData) dayData.matches++
    })
  }

  // Populate players
  if (recentPlayers) {
    recentPlayers.forEach((p: any) => {
      const d = new Date(p.created_at)
      const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
      const dayData = activityData.find(d => d.dateString === localDateStr)
      if (dayData) dayData.players++
    })
  }

  return {
    activeTournaments: activeTournaments || 0,
    registeredTeams: registeredTeams || 0,
    totalPlayers: totalPlayers || 0,
    liveMatches: liveMatches || 0,
    recentTournaments: recentTournaments || [],
    activityChartData: activityData.map(({ name, matches, players }) => ({ name, matches, players }))
  }
}
