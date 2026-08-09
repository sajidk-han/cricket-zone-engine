-- =================================================================================
-- Enterprise Standings Engine Schema (v3.1)
-- Adds performance indexes and a cache table for tournament standings.
-- =================================================================================

-- 1. Performance Indexes
CREATE INDEX IF NOT EXISTS idx_matches_tournament_status ON matches(tournament_id, status);
CREATE INDEX IF NOT EXISTS idx_tournament_teams_tournament_id ON tournament_teams(tournament_id);
CREATE INDEX IF NOT EXISTS idx_matches_team1_id ON matches(team1_id);
CREATE INDEX IF NOT EXISTS idx_matches_team2_id ON matches(team2_id);

-- 2. Tournament Standings Cache Table
CREATE TABLE IF NOT EXISTS tournament_standings_cache (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tournament_id UUID REFERENCES tournaments(id) ON DELETE CASCADE,
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    
    -- Standings Aggregates
    played INTEGER DEFAULT 0,
    won INTEGER DEFAULT 0,
    lost INTEGER DEFAULT 0,
    tied INTEGER DEFAULT 0,
    no_result INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    
    -- NRR Projection Fields
    runs_for INTEGER DEFAULT 0,
    overs_for DECIMAL(5,1) DEFAULT 0.0,
    runs_against INTEGER DEFAULT 0,
    overs_against DECIMAL(5,1) DEFAULT 0.0,
    nrr DECIMAL(5,3) DEFAULT 0.000,
    
    -- Ranking
    position INTEGER DEFAULT 0,
    
    -- Future Ready Group/Stage fields
    stage VARCHAR(50) DEFAULT 'League',
    group_name VARCHAR(50),
    qualification_status VARCHAR(50),
    
    -- Audit fields
    last_calculated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    
    -- A team can only have one standing entry per tournament/stage/group
    UNIQUE(tournament_id, team_id, stage, group_name)
);

-- Enable RLS on the cache table
ALTER TABLE tournament_standings_cache ENABLE ROW LEVEL SECURITY;

-- Tenant Isolation Policies
CREATE POLICY "Tenant Isolation: Read Standings Cache" ON tournament_standings_cache FOR SELECT 
USING (tournament_id IN (SELECT id FROM tournaments WHERE org_id IN (SELECT user_orgs())));

-- Full access for service role or org admins (assuming appropriate functions)
-- For simplicity in this tier, we will allow all authenticated users of the org to read
-- But only let functions / server-actions with service_role write to it.
-- This ensures "Never manually edit standings" rule is physically enforced at DB level unless bypassed by admin role.
