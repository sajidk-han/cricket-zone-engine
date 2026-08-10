import { NextResponse } from 'next/server'
import { createClient, createAdminClient } from '@/lib/supabase-server'

export async function GET(request: Request) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized. Please login first.' }, { status: 401 })
    }

    const adminSupabase = createAdminClient()
    
    // 1. Create Organization
    const { data: org, error: orgError } = await adminSupabase
      .from('organizations')
      .insert({
        name: 'Eagles Cricket Club',
        slug: `eagles-${Date.now()}`,
        settings: { timezone: 'Asia/Karachi' }
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Add user as org admin
    await adminSupabase.from('organization_members').insert({
      org_id: org.id,
      user_id: user.id,
      role: 'admin'
    })

    // 2. Create Tournament
    const { data: tournament, error: tournError } = await adminSupabase
      .from('tournaments')
      .insert({
        org_id: org.id,
        name: 'Shangla Super League 2026',
        slug: `ssl-${Date.now()}`,
        format: 't20',
        overs_per_innings: 20,
        status: 'scheduled',
        start_date: new Date().toISOString()
      })
      .select()
      .single()

    if (tournError) throw tournError

    // 3. Create Teams
    const teamsToCreate = [
      { name: 'Kaardan Warriors', short_name: 'KW', slug: `kw-${Date.now()}` },
      { name: 'Abseen Heroes', short_name: 'AH', slug: `ah-${Date.now()}` }
    ]

    const { data: teams, error: teamsError } = await adminSupabase
      .from('teams')
      .insert(teamsToCreate.map(t => ({ org_id: org.id, ...t })))
      .select()

    if (teamsError) throw teamsError

    const kwTeam = teams.find(t => t.short_name === 'KW')
    const ahTeam = teams.find(t => t.short_name === 'AH')

    // 4. Enroll Teams in Tournament
    await adminSupabase.from('tournament_teams').insert([
      { tournament_id: tournament.id, team_id: kwTeam.id },
      { tournament_id: tournament.id, team_id: ahTeam.id }
    ])

    // 5. Create Players
    const generatePlayer = (name: string, role: string) => ({
      org_id: org.id,
      full_name: name,
      primary_role: role,
      batting_style: 'Right-hand bat',
      bowling_style: role === 'Bowler' || role === 'All-rounder' ? 'Right-arm fast' : null
    })

    const kwPlayers = [
      generatePlayer('Sajid Khan', 'Batter'),
      generatePlayer('Ali Raza', 'Batter'),
      generatePlayer('Usman Tariq', 'Wicket-keeper'),
      generatePlayer('Fahad Mustafa', 'All-rounder'),
      generatePlayer('Hassan Ali', 'All-rounder'),
      generatePlayer('Kamran Akmal', 'Batter'),
      generatePlayer('Shaheen Shah', 'Bowler'),
      generatePlayer('Naseem Shah', 'Bowler'),
      generatePlayer('Haris Rauf', 'Bowler'),
      generatePlayer('Shadab Khan', 'All-rounder'),
      generatePlayer('Imad Wasim', 'All-rounder')
    ]

    const ahPlayers = [
      generatePlayer('Babar Azam', 'Batter'),
      generatePlayer('Mohammad Rizwan', 'Wicket-keeper'),
      generatePlayer('Fakhar Zaman', 'Batter'),
      generatePlayer('Saim Ayub', 'Batter'),
      generatePlayer('Iftikhar Ahmed', 'All-rounder'),
      generatePlayer('Salman Ali', 'All-rounder'),
      generatePlayer('Mohammad Amir', 'Bowler'),
      generatePlayer('Zaman Khan', 'Bowler'),
      generatePlayer('Usama Mir', 'Bowler'),
      generatePlayer('Abrar Ahmed', 'Bowler'),
      generatePlayer('Saud Shakeel', 'Batter')
    ]

    // Insert all players
    const { data: insertedPlayers, error: playersError } = await adminSupabase
      .from('players')
      .insert([...kwPlayers, ...ahPlayers])
      .select()
      
    if (playersError) throw playersError

    // 6. Assign players to teams
    const tpInserts = []
    
    // First 11 to KW, Next 11 to AH
    for (let i = 0; i < 11; i++) {
      tpInserts.push({ org_id: org.id, team_id: kwTeam.id, player_id: insertedPlayers[i].id, role: 'Player' })
    }
    for (let i = 11; i < 22; i++) {
      tpInserts.push({ org_id: org.id, team_id: ahTeam.id, player_id: insertedPlayers[i].id, role: 'Player' })
    }

    await adminSupabase.from('team_players').insert(tpInserts)

    // 7. Create a Match
    const scheduledDate = new Date()
    scheduledDate.setHours(scheduledDate.getHours() + 2) // Schedule 2 hours from now

    const { data: match, error: matchError } = await adminSupabase
      .from('matches')
      .insert({
        org_id: org.id,
        tournament_id: tournament.id,
        team1_id: kwTeam.id,
        team2_id: ahTeam.id,
        status: 'scheduled',
        match_type: 't20',
        match_stage: 'Group',
        scheduled_time: scheduledDate.toISOString(),
        slug: `kw-vs-ah-${Date.now()}`
      })
      .select()
      .single()

    if (matchError) throw matchError

    return NextResponse.json({
      success: true,
      message: 'Demo ecosystem seeded successfully!',
      details: {
        organization: org.name,
        tournament: tournament.name,
        teams: [kwTeam.name, ahTeam.name],
        playersCount: insertedPlayers.length,
        matchUrl: `/matches/${match.id}`
      }
    })

  } catch (error: any) {
    console.error('Seeding error:', error)
    return NextResponse.json({ error: error.message || 'Failed to seed data' }, { status: 500 })
  }
}
