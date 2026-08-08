const { createClient } = require('@supabase/supabase-js');


const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testQuery() {
  const { data, error } = await supabase
    .from('matches')
    .select(`
      id, slug, status, team1_id, team2_id, winning_team_id,
      scheduled_time, start_time, ground_name, match_stage,
      team1:teams!matches_team1_id_fkey(id, name, short_name, logo_url),
      team2:teams!matches_team2_id_fkey(id, name, short_name, logo_url),
      tournament:tournaments(id, name, slug),
      innings(innings_number, batting_team_id, total_runs, total_wickets, overs_bowled)
    `)
    .limit(1);

  if (error) {
    console.error('Query failed:', error);
  } else {
    console.log('Query success:', JSON.stringify(data, null, 2));
  }
}

testQuery();
