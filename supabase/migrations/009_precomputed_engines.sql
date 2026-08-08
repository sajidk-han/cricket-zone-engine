-- Migration 009: Precomputed Engines Architecture
-- Moves heavy aggregations (Leaderboards, Standings, Career) to physical tables

-- 1. Tournament Standings (Precomputed Points Table)
CREATE TABLE IF NOT EXISTS tournament_standings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    tournament_id UUID NOT NULL REFERENCES tournaments(id),
    team_id UUID NOT NULL REFERENCES teams(id),
    
    matches_played INTEGER DEFAULT 0,
    matches_won INTEGER DEFAULT 0,
    matches_lost INTEGER DEFAULT 0,
    matches_tied INTEGER DEFAULT 0,
    no_result INTEGER DEFAULT 0,
    
    points INTEGER DEFAULT 0,
    
    runs_for INTEGER DEFAULT 0,
    overs_faced DECIMAL(10,2) DEFAULT 0.0,
    runs_against INTEGER DEFAULT 0,
    overs_bowled DECIMAL(10,2) DEFAULT 0.0,
    net_run_rate DECIMAL(10,3) DEFAULT 0.000,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(tournament_id, team_id)
);

-- RLS for Standings
ALTER TABLE tournament_standings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view standings of visible tournaments" ON tournament_standings FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM tournaments t WHERE t.id = tournament_standings.tournament_id AND t.visibility IN ('public', 'unlisted')
    ));

-- 2. Tournament Player Statistics (Precomputed Leaderboards)
CREATE TABLE IF NOT EXISTS tournament_statistics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    org_id UUID NOT NULL REFERENCES organizations(id),
    tournament_id UUID NOT NULL REFERENCES tournaments(id),
    player_id UUID NOT NULL REFERENCES players(id),
    team_id UUID NOT NULL REFERENCES teams(id),
    
    matches_played INTEGER DEFAULT 0,
    runs_scored INTEGER DEFAULT 0,
    balls_faced INTEGER DEFAULT 0,
    fours INTEGER DEFAULT 0,
    sixes INTEGER DEFAULT 0,
    highest_score INTEGER DEFAULT 0,
    not_outs INTEGER DEFAULT 0,
    
    wickets_taken INTEGER DEFAULT 0,
    runs_conceded INTEGER DEFAULT 0,
    balls_bowled INTEGER DEFAULT 0,
    maidens INTEGER DEFAULT 0,
    
    catches INTEGER DEFAULT 0,
    run_outs INTEGER DEFAULT 0,
    
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    UNIQUE(tournament_id, player_id)
);

ALTER TABLE tournament_statistics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can view player stats of visible tournaments" ON tournament_statistics FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM tournaments t WHERE t.id = tournament_statistics.tournament_id AND t.visibility IN ('public', 'unlisted')
    ));

-- 3. Update Player Career Stats RLS
-- (Table already exists from 001_initial_schema.sql)
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public can view player career stats" ON player_career_stats;
EXCEPTION WHEN undefined_object THEN
END $$;

CREATE POLICY "Public can view career stats of visible players" ON player_career_stats FOR SELECT 
    USING (EXISTS (
        SELECT 1 FROM players p WHERE p.id = player_career_stats.player_id AND p.visibility IN ('public', 'unlisted')
    ));
